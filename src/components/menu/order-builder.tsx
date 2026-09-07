"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Plus, Info, ArrowRight, Clock } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { WEEKDAY_LABEL, formatDateLabel, dateKey } from "@/lib/schedule";
import { CATEGORY_LABEL, CATEGORY_ORDER } from "@/lib/menu-labels";
import { formatPrice } from "@/lib/currency";
import type { MenuItem, Weekday, Child } from "@/generated/prisma";
import type { OrderableDay } from "@/lib/schedule";

export function OrderBuilder({
  menuByWeekday,
  orderableDays,
  kids,
  isLoggedIn,
}: {
  menuByWeekday: Record<Weekday, MenuItem[]>;
  orderableDays: OrderableDay[];
  kids: Child[];
  isLoggedIn: boolean;
}) {
  const [dayIdx, setDayIdx] = useState(0);
  const [childId, setChildId] = useState<string | undefined>(kids[0]?.id);
  const { lines, hasLine, toggleLine } = useCart();

  const day = orderableDays[dayIdx];
  const items = menuByWeekday[day.weekday] ?? [];
  const dk = dateKey(day.date);

  const allMenuItems = useMemo(
    () => Object.values(menuByWeekday).flat(),
    [menuByWeekday]
  );
  const priceById = useMemo(
    () => new Map(allMenuItems.map((i) => [i.id, i.price])),
    [allMenuItems]
  );
  const total = lines.reduce(
    (sum, l) => sum + (priceById.get(l.menuItemId) ?? 0),
    0
  );

  const canOrder = isLoggedIn && Boolean(childId);

  return (
    <div className="mt-8">
      {!isLoggedIn && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3.5 text-sm text-foreground">
          <Info size={20} className="shrink-0 text-primary" />
          <span>
            <Link href="/vhod" className="uhd-focus-ring rounded font-medium text-primary hover:underline">
              Влезте
            </Link>{" "}
            или{" "}
            <Link href="/registracia" className="uhd-focus-ring rounded font-medium text-primary hover:underline">
              се регистрирайте
            </Link>
            , за да поръчате храна за детето си.
          </span>
        </div>
      )}

      {isLoggedIn && kids.length === 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3.5 text-sm text-foreground">
          <Info size={20} className="shrink-0 text-primary" />
          <span>
            Първо{" "}
            <Link href="/profil/deca" className="uhd-focus-ring rounded font-medium text-primary hover:underline">
              добавете дете
            </Link>{" "}
            в профила си, за да можете да поръчвате.
          </span>
        </div>
      )}

      {/* Order deadline disclaimer */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/12 px-4 py-3.5 text-sm text-foreground">
        <Clock size={20} weight="bold" className="mt-0.5 shrink-0 text-on-accent" />
        <span>
          <strong className="font-medium">
            Поръчвайте до 17:00 ч. предния учебен ден
          </strong>{" "}
          — за поръчки за понеделник крайният срок е 17:00 ч. в петък. Дните
          по-долу показват само все още отворените за поръчка дати.
        </span>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {orderableDays.map((d, i) => {
          const active = i === dayIdx;
          return (
            <button
              key={dateKey(d.date)}
              type="button"
              onClick={() => setDayIdx(i)}
              className={`uhd-focus-ring shrink-0 rounded-xl border px-4 py-2.5 text-left transition-colors ${
                active
                  ? "border-primary bg-primary text-on-primary"
                  : "border-border bg-surface text-foreground hover:border-primary/40"
              }`}
            >
              <span className="block text-xs font-medium uppercase tracking-wide opacity-80">
                {WEEKDAY_LABEL[d.weekday].slice(0, 3)}
              </span>
              <span className="block text-sm font-medium">
                {formatDateLabel(d.date)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Child selector */}
      {kids.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Поръчвам за:</span>
          {kids.map((c) => {
            const active = c.id === childId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setChildId(c.id)}
                className={`uhd-focus-ring rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-secondary bg-secondary text-on-secondary"
                    : "border-border bg-surface text-foreground hover:border-secondary/50"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Menu items for the day */}
      <div className="mt-8 space-y-8">
        {CATEGORY_ORDER.map((category) => {
          const categoryItems = items.filter((i) => i.category === category);
          if (categoryItems.length === 0) return null;
          return (
            <div key={category}>
              <h2 className="font-display text-lg font-medium text-foreground">
                {CATEGORY_LABEL[category]}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {categoryItems.map((item) => {
                  const inCart =
                    canOrder && childId
                      ? hasLine(childId, item.id, dk)
                      : false;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-start justify-between gap-4 rounded-2xl border p-4 ${
                        inCart
                          ? "border-secondary bg-secondary/6"
                          : "border-border bg-surface"
                      }`}
                    >
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-medium text-foreground">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="mt-2 text-sm font-medium text-primary">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={!canOrder}
                        aria-label={
                          inCart
                            ? `Премахни ${item.name}`
                            : `Добави ${item.name}`
                        }
                        onClick={() =>
                          childId &&
                          toggleLine({ childId, menuItemId: item.id, dateKey: dk })
                        }
                        className={`uhd-focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          inCart
                            ? "border-secondary bg-secondary text-on-secondary"
                            : "border-border bg-surface text-primary hover:border-primary"
                        }`}
                      >
                        {inCart ? <Check size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {lines.length > 0 && (
        <div className="sticky bottom-4 mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface/95 p-4 shadow-lg backdrop-blur">
          <div>
            <p className="text-sm text-muted-foreground">
              {lines.length}{" "}
              {lines.length === 1 ? "артикул" : "артикула"} в кошницата
            </p>
            <p className="font-display text-lg font-medium text-foreground">
              {formatPrice(total)}
            </p>
          </div>
          <Button href="/kosnica">
            Към плащане
            <ArrowRight size={18} weight="bold" />
          </Button>
        </div>
      )}
    </div>
  );
}
