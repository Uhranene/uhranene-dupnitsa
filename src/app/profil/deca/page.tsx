import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getParentId } from "@/lib/auth";
import { AddChildForm } from "@/components/profile/add-child-form";
import { RemoveChildButton } from "@/components/profile/remove-child-button";

export const metadata: Metadata = { title: "Моите деца | Ученическо хранене - Дупница" };

const AVATAR_STYLES = [
  { tint: "bg-primary/12 text-primary", emoji: "🎒" },
  { tint: "bg-secondary/12 text-secondary", emoji: "📚" },
  { tint: "bg-fun-blue/15 text-fun-blue", emoji: "⭐" },
  { tint: "bg-fun-pink/15 text-fun-pink", emoji: "🍎" },
  { tint: "bg-accent/25 text-on-accent", emoji: "🖍️" },
];

export default async function ChildrenPage() {
  const parentId = await getParentId();
  if (!parentId) redirect("/vhod");

  const children = await prisma.child.findMany({
    where: { parentId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-foreground">
        Моите деца <span aria-hidden="true">🎒</span>
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Добавете децата си, за да можете да поръчвате храна за тях.
      </p>

      <div className="mt-6 space-y-3">
        {children.map((child, i) => {
          const avatar = AVATAR_STYLES[i % AVATAR_STYLES.length];
          return (
            <div
              key={child.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-lg ${avatar.tint}`}
                  aria-hidden="true"
                >
                  {avatar.emoji}
                </div>
                <div>
                  <p className="font-medium text-foreground">{child.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {child.schoolName} · {child.grade} клас
                  </p>
                </div>
              </div>
              <RemoveChildButton childId={child.id} childName={child.name} />
            </div>
          );
        })}
        {children.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Все още нямате добавени деца.
          </p>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-base font-medium text-foreground">
          Добави дете <span aria-hidden="true">➕</span>
        </h2>
        <div className="mt-4">
          <AddChildForm />
        </div>
      </div>
    </div>
  );
}
