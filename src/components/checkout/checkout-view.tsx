"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash, Info, LockKey, CreditCard } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { placeOrder } from "@/actions/orders";
import { formatPrice } from "@/lib/currency";
import type { Child, MenuItem } from "@/generated/prisma";

function formatDateWithWeekday(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString("bg-BG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function CheckoutView({
  isLoggedIn,
  kids,
  menuItems,
}: {
  isLoggedIn: boolean;
  kids: Child[];
  menuItems: MenuItem[];
}) {
  const { lines, removeLine, clear, ready } = useCart();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const childById = useMemo(
    () => new Map(kids.map((c) => [c.id, c])),
    [kids]
  );
  const itemById = useMemo(
    () => new Map(menuItems.map((m) => [m.id, m])),
    [menuItems]
  );

  const groups = useMemo(() => {
    const byDate = new Map<string, typeof lines>();
    for (const line of lines) {
      const arr = byDate.get(line.dateKey) ?? [];
      arr.push(line);
      byDate.set(line.dateKey, arr);
    }
    return [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [lines]);

  const total = lines.reduce(
    (sum, l) => sum + (itemById.get(l.menuItemId)?.price ?? 0),
    0
  );

  if (!ready) return null;

  if (!isLoggedIn) {
    return (
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/8 px-5 py-4 text-sm text-foreground">
        <Info size={20} className="mt-0.5 shrink-0 text-primary" />
        <span>
          <Link
            href="/vhod?next=/kosnica"
            className="uhd-focus-ring rounded font-medium text-primary hover:underline"
          >
            Влезте в профила си
          </Link>{" "}
          , за да завършите поръчката. Кошницата Ви ще Ви чака.
        </span>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-muted-foreground">Кошницата Ви е празна.</p>
        <Button href="/menu" className="mt-5">
          Разгледай менюто
        </Button>
      </div>
    );
  }

  function handlePay() {
    setError(null);
    startTransition(async () => {
      const result = await placeOrder(lines);
      if (result.ok) {
        clear();
        router.push(`/profil/porachki?success=1`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {groups.map(([dk, groupLines]) => (
          <div key={dk} className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="font-display text-base font-medium capitalize text-foreground">
              {formatDateWithWeekday(dk)}
            </h2>
            <div className="mt-3 divide-y divide-border">
              {groupLines.map((line) => {
                const item = itemById.get(line.menuItemId);
                const child = childById.get(line.childId);
                if (!item || !child) return null;
                return (
                  <div
                    key={`${line.childId}-${line.menuItemId}-${line.dateKey}`}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        за {child.name}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-medium text-foreground">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        type="button"
                        aria-label={`Премахни ${item.name}`}
                        onClick={() =>
                          removeLine(line.childId, line.menuItemId, line.dateKey)
                        }
                        className="uhd-focus-ring flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-24">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Артикули</span>
          <span>{lines.length}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-3 font-display text-lg font-medium text-foreground">
          <span>Общо</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="mt-6 space-y-4">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <CreditCard size={16} />
            Данни за картата (демо)
          </p>
          <Field
            label="Номер на карта"
            name="cardNumber"
            placeholder="4111 1111 1111 1111"
            inputMode="numeric"
            disabled={pending}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Валидност" name="expiry" placeholder="ММ/ГГ" disabled={pending} />
            <Field label="CVC" name="cvc" placeholder="123" inputMode="numeric" disabled={pending} />
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={handlePay}
            disabled={pending}
          >
            {pending ? "Обработка..." : `Плати ${formatPrice(total)}`}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <LockKey size={14} />
            Демо разплащане — реален доставчик на плащания предстои.
          </p>
        </div>
      </div>
    </div>
  );
}
