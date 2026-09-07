import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { getParentId } from "@/lib/auth";
import { CouponCard } from "@/components/profile/coupon-card";
import { formatPrice } from "@/lib/currency";

export const metadata: Metadata = { title: "Моите поръчки | Ученическо хранене - Дупница" };

export default async function OrdersPage({
  searchParams,
}: PageProps<"/profil/porachki">) {
  const params = await searchParams;
  const parentId = await getParentId();
  if (!parentId) redirect("/vhod");

  const orders = await prisma.order.findMany({
    where: { parentId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { child: true, menuItem: true },
        orderBy: { mealDate: "asc" },
      },
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-foreground">
        Моите поръчки <span aria-hidden="true">🍽️</span>
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Поръчката се изпраща директно на кухнята — талоните по-долу са Вашето
        потвърждение за платената храна.
      </p>

      {params.success && (
        <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-secondary/30 bg-secondary/8 px-4 py-3 text-sm text-secondary">
          <CheckCircle size={20} weight="bold" className="shrink-0" />
          Поръчката е платена успешно! Талоните са готови по-долу. <span aria-hidden="true">🎉</span>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {orders.map((order) => (
          <div key={order.id}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                <span aria-hidden="true">📅</span> Поръчка от{" "}
                {order.createdAt.toLocaleDateString("bg-BG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <span className="font-display text-sm font-medium text-foreground">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="mt-3 space-y-2.5">
              {order.items.map((item) => (
                <CouponCard
                  key={item.id}
                  couponCode={item.child.couponCode}
                  childName={item.child.name}
                  itemName={item.menuItem.name}
                  mealDate={item.mealDate}
                />
              ))}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Все още нямате направени поръчки.
          </p>
        )}
      </div>
    </div>
  );
}
