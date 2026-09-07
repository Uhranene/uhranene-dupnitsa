import type { Weekday } from "@/generated/prisma";

export const WEEKDAY_ORDER: Weekday[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  MONDAY: "Понеделник",
  TUESDAY: "Вторник",
  WEDNESDAY: "Сряда",
  THURSDAY: "Четвъртък",
  FRIDAY: "Петък",
};

const JS_DAY_TO_WEEKDAY: Record<number, Weekday | null> = {
  0: null,
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: null,
};

/** The hour of day (24h, local time) after which ordering for the next school day closes. */
export const ORDER_CUTOFF_HOUR = 17;

export type OrderableDay = {
  date: Date;
  weekday: Weekday;
  label: string;
};

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * The school day the daily kitchen summary should cover when run at the
 * end of a day — tomorrow, or Monday if run on a Friday (weekend has no
 * classes/meals).
 */
export function getNextSchoolDay(from: Date = new Date()): Date {
  const cursor = startOfDay(from);
  cursor.setDate(cursor.getDate() + 1);
  while (!JS_DAY_TO_WEEKDAY[cursor.getDay()]) {
    cursor.setDate(cursor.getDate() + 1);
  }
  return cursor;
}

/**
 * Ordering for a school day closes at ORDER_CUTOFF_HOUR on the school day
 * right before it (so Monday's cutoff falls on Friday, skipping the
 * weekend) — this is the kitchen's prep-time deadline.
 */
export function getOrderCutoff(date: Date): Date {
  const cursor = startOfDay(date);
  do {
    cursor.setDate(cursor.getDate() - 1);
  } while (!JS_DAY_TO_WEEKDAY[cursor.getDay()]);
  cursor.setHours(ORDER_CUTOFF_HOUR, 0, 0, 0);
  return cursor;
}

/** Whether a school day can still be ordered for, as of `now`. */
export function isOrderable(date: Date, now: Date = new Date()): boolean {
  if (!JS_DAY_TO_WEEKDAY[date.getDay()]) return false;
  return now < getOrderCutoff(date);
}

/**
 * Returns the next 10 school days that are still orderable — i.e. their
 * ORDER_CUTOFF_HOUR deadline (on the school day before) hasn't passed yet.
 */
export function getOrderableDays(from: Date = new Date()): OrderableDay[] {
  const days: OrderableDay[] = [];
  const cursor = startOfDay(from);
  cursor.setDate(cursor.getDate() + 1);

  while (days.length < 10) {
    const weekday = JS_DAY_TO_WEEKDAY[cursor.getDay()];
    if (weekday && isOrderable(cursor, from)) {
      days.push({
        date: new Date(cursor),
        weekday,
        label: formatDateLabel(cursor),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function formatDateLabel(date: Date) {
  return date.toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "long",
  });
}

export function formatDateShort(date: Date) {
  return date.toLocaleDateString("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function dateKey(date: Date) {
  const d = startOfDay(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
