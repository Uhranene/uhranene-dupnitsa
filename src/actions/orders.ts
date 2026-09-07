"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getParentId } from "@/lib/auth";
import { sendOrderNotification } from "@/lib/email";
import { isOrderable } from "@/lib/schedule";

const lineSchema = z.object({
  childId: z.string().min(1),
  menuItemId: z.string().min(1),
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const placeOrderSchema = z.array(lineSchema).min(1);

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export async function placeOrder(
  rawLines: unknown
): Promise<PlaceOrderResult> {
  const parentId = await getParentId();
  if (!parentId) {
    return { ok: false, error: "Моля, влезте в профила си, за да поръчате." };
  }

  const parent = await prisma.parent.findUnique({ where: { id: parentId } });
  if (!parent) {
    return { ok: false, error: "Профилът не е намерен." };
  }

  const parsed = placeOrderSchema.safeParse(rawLines);
  if (!parsed.success) {
    return { ok: false, error: "Кошницата е празна или невалидна." };
  }
  const lines = parsed.data;

  const childIds = [...new Set(lines.map((l) => l.childId))];
  const children = await prisma.child.findMany({
    where: { id: { in: childIds }, parentId },
  });
  if (children.length !== childIds.length) {
    return { ok: false, error: "Невалидно дете в поръчката." };
  }

  const now = new Date();
  const pastDeadline = lines.some(
    (l) => !isOrderable(new Date(`${l.dateKey}T00:00:00`), now)
  );
  if (pastDeadline) {
    return {
      ok: false,
      error:
        "Крайният срок за поръчка (17:00 ч. предния учебен ден) за някоя от избраните дати е изтекъл.",
    };
  }

  const menuItemIds = [...new Set(lines.map((l) => l.menuItemId))];
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, active: true },
  });
  const menuItemById = new Map(menuItems.map((m) => [m.id, m]));
  if (menuItemById.size !== menuItemIds.length) {
    return { ok: false, error: "Артикул от менюто вече не е наличен." };
  }

  const totalAmount = lines.reduce((sum, l) => {
    const item = menuItemById.get(l.menuItemId)!;
    return sum + item.price;
  }, 0);

  const order = await prisma.order.create({
    data: {
      parentId,
      status: "PAID",
      totalAmount,
      items: {
        create: lines.map((l) => {
          const item = menuItemById.get(l.menuItemId)!;
          return {
            childId: l.childId,
            menuItemId: l.menuItemId,
            mealDate: new Date(`${l.dateKey}T00:00:00`),
            unitPrice: item.price,
          };
        }),
      },
    },
    include: {
      items: { include: { child: true, menuItem: true } },
    },
  });

  await sendOrderNotification({
    orderId: order.id,
    parentName: parent.name,
    parentEmail: parent.email,
    parentPhone: parent.phone,
    totalAmount: order.totalAmount,
    items: order.items.map((item) => ({
      childName: item.child.name,
      grade: item.child.grade,
      schoolName: item.child.schoolName,
      itemName: item.menuItem.name,
      mealDate: item.mealDate,
      couponCode: item.child.couponCode,
      unitPrice: item.unitPrice,
    })),
  });

  return { ok: true, orderId: order.id };
}
