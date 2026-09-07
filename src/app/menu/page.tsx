import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getParentId } from "@/lib/auth";
import { getOrderableDays, WEEKDAY_ORDER } from "@/lib/schedule";
import { OrderBuilder } from "@/components/menu/order-builder";
import type { Weekday } from "@/generated/prisma";

export const metadata: Metadata = {
  title: "Меню и поръчка | Ученическо хранене - Дупница",
};

export default async function MenuPage() {
  const parentId = await getParentId();

  const [menuItems, kids] = await Promise.all([
    prisma.menuItem.findMany({
      where: { active: true },
      orderBy: [{ weekday: "asc" }, { category: "asc" }, { sortOrder: "asc" }],
    }),
    parentId
      ? prisma.child.findMany({
          where: { parentId },
          orderBy: { createdAt: "asc" },
        })
      : Promise.resolve([]),
  ]);

  const menuByWeekday = WEEKDAY_ORDER.reduce(
    (acc, day) => {
      acc[day] = menuItems.filter((item) => item.weekday === day);
      return acc;
    },
    {} as Record<Weekday, typeof menuItems>
  );

  const orderableDays = getOrderableDays();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
          Седмично меню и поръчка
        </h1>
        <p className="mt-3 text-muted-foreground">
          Изберете ден и дете, след което добавете храна от менюто. Поръчките
          за даден учебен ден се приемат до 17:00 ч. предния учебен ден.
        </p>
      </div>

      <OrderBuilder
        menuByWeekday={menuByWeekday}
        orderableDays={orderableDays}
        kids={kids}
        isLoggedIn={Boolean(parentId)}
      />
    </div>
  );
}
