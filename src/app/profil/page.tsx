import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { getParentId } from "@/lib/auth";

export const metadata: Metadata = { title: "Моят профил | Ученическо хранене - Дупница" };

export default async function ProfilePage() {
  const parentId = await getParentId();
  if (!parentId) redirect("/vhod");

  const parent = await prisma.parent.findUniqueOrThrow({
    where: { id: parentId },
  });

  const [childrenCount, ordersCount] = await Promise.all([
    prisma.child.count({ where: { parentId } }),
    prisma.order.count({ where: { parentId } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-foreground">
        Здравейте, {parent.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{parent.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/profil/deca"
          className="uhd-focus-ring group flex items-center justify-between rounded-2xl border border-border bg-surface p-5 hover:border-primary/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-lg" aria-hidden="true">
              🎒
            </div>
            <div>
              <p className="font-display text-base font-medium text-foreground">
                Моите деца
              </p>
              <p className="text-sm text-muted-foreground">
                {childrenCount} {childrenCount === 1 ? "дете" : "деца"}
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary" />
        </Link>

        <Link
          href="/profil/porachki"
          className="uhd-focus-ring group flex items-center justify-between rounded-2xl border border-border bg-surface p-5 hover:border-primary/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/10 text-lg" aria-hidden="true">
              🍽️
            </div>
            <div>
              <p className="font-display text-base font-medium text-foreground">
                Моите поръчки
              </p>
              <p className="text-sm text-muted-foreground">
                {ordersCount} {ordersCount === 1 ? "поръчка" : "поръчки"}
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary" />
        </Link>
      </div>
    </div>
  );
}
