import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getParentId } from "@/lib/auth";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Плащане | Ученическо хранене - Дупница",
};

export default async function CheckoutPage() {
  const parentId = await getParentId();

  const [kids, menuItems] = await Promise.all([
    parentId
      ? prisma.child.findMany({ where: { parentId } })
      : Promise.resolve([]),
    prisma.menuItem.findMany(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Кошница и плащане
      </h1>
      <p className="mt-3 text-muted-foreground">
        Прегледайте поръчката и завършете плащането онлайн.
      </p>

      <CheckoutView
        isLoggedIn={Boolean(parentId)}
        kids={kids}
        menuItems={menuItems}
      />
    </div>
  );
}
