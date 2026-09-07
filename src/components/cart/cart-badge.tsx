"use client";

import Link from "next/link";
import { ShoppingCart } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-context";

export function CartBadge() {
  const { lines, ready } = useCart();
  const count = lines.length;

  return (
    <Link
      href="/kosnica"
      aria-label={`Кошница, ${count} артикула`}
      className="uhd-focus-ring relative flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-muted"
    >
      <ShoppingCart size={22} />
      {ready && count > 0 && (
        <span className="absolute right-1 top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-semibold text-on-primary">
          {count}
        </span>
      )}
    </Link>
  );
}
