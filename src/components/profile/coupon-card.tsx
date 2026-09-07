import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export function CouponCard({
  couponCode,
  childName,
  itemName,
  mealDate,
}: {
  couponCode: string;
  childName: string;
  itemName: string;
  mealDate: Date;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/12 via-secondary/6 to-transparent p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/25 text-lg"
          aria-hidden="true"
        >
          🎟️
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-medium tracking-wide text-foreground">
            {couponCode}
          </p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            🍽️ {itemName} · {childName}
          </p>
          <p className="text-xs text-muted-foreground">
            {mealDate.toLocaleDateString("bg-BG", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1.5 text-xs font-medium text-secondary">
        <CheckCircle size={14} weight="bold" />
        Платен
      </span>
    </div>
  );
}
