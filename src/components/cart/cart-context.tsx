"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useMemo,
  type ReactNode,
} from "react";

export type CartLine = {
  childId: string;
  menuItemId: string;
  dateKey: string; // yyyy-mm-dd
};

const STORAGE_KEY = "uhd_cart_v1";
const EMPTY_LINES: CartLine[] = [];

let cachedLines: CartLine[] | null = null;
const listeners = new Set<() => void>();

function readLinesFromStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): CartLine[] {
  if (cachedLines === null) {
    cachedLines = readLinesFromStorage();
  }
  return cachedLines;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY_LINES;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedLines = null;
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function writeLines(lines: CartLine[]) {
  cachedLines = lines;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // ignore write failures (private browsing, storage full, etc.)
  }
  listeners.forEach((notify) => notify());
}

function sameLine(a: CartLine, b: CartLine) {
  return (
    a.childId === b.childId &&
    a.menuItemId === b.menuItemId &&
    a.dateKey === b.dateKey
  );
}

type CartContextValue = {
  lines: CartLine[];
  hasLine: (childId: string, menuItemId: string, dateKey: string) => boolean;
  toggleLine: (line: CartLine) => void;
  removeLine: (childId: string, menuItemId: string, dateKey: string) => void;
  clear: () => void;
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      ready: true,
      hasLine: (childId, menuItemId, dateKey) =>
        lines.some((l) => sameLine(l, { childId, menuItemId, dateKey })),
      toggleLine: (line) =>
        writeLines(
          lines.some((l) => sameLine(l, line))
            ? lines.filter((l) => !sameLine(l, line))
            : [...lines, line]
        ),
      removeLine: (childId, menuItemId, dateKey) =>
        writeLines(
          lines.filter((l) => !sameLine(l, { childId, menuItemId, dateKey }))
        ),
      clear: () => writeLines([]),
    }),
    [lines]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
