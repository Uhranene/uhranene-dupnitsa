import "server-only";
import { Resend } from "resend";
import { formatPrice } from "@/lib/currency";

type NotificationItem = {
  childName: string;
  grade: string;
  schoolName: string;
  itemName: string;
  mealDate: Date;
  couponCode: string;
  unitPrice: number;
};

type OrderNotification = {
  orderId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string | null;
  totalAmount: number;
  items: NotificationItem[];
};

export type PickupRow = {
  childName: string;
  grade: string;
  schoolName: string;
  couponCode: string;
  itemName: string;
};

const NOTIFY_EMAIL = process.env.ORDERS_NOTIFICATION_EMAIL;
const FROM_EMAIL = process.env.ORDERS_FROM_EMAIL ?? "onboarding@resend.dev";
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function formatDate(date: Date) {
  return date.toLocaleDateString("bg-BG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * Sends one plain-text email to the kitchen/office inbox — the single
 * hand-off point since this app has no staff login. Falls back to a
 * console log when RESEND_API_KEY or ORDERS_NOTIFICATION_EMAIL aren't
 * configured yet, and never throws (a notification failure must not
 * block a parent's checkout, and a cron hit shouldn't 500 either).
 */
async function sendToKitchen(subject: string, text: string) {
  if (!resend || !NOTIFY_EMAIL) {
    console.log(
      "[email] RESEND_API_KEY or ORDERS_NOTIFICATION_EMAIL not set — email not sent. Would have sent:\n" +
        `To: ${NOTIFY_EMAIL ?? "(не е зададен ORDERS_NOTIFICATION_EMAIL)"}\n` +
        `Subject: ${subject}\n\n${text}`
    );
    return;
  }

  try {
    await resend.emails.send({ from: FROM_EMAIL, to: NOTIFY_EMAIL, subject, text });
  } catch (error) {
    console.error("[email] Failed to send email:", error);
  }
}

function buildEmailBody(order: OrderNotification) {
  const rows = order.items
    .map(
      (item) =>
        `  • ${item.childName} (${item.grade} клас, ${item.schoolName}) — ${item.itemName}, ${formatDate(item.mealDate)} — талон ${item.couponCode} — ${formatPrice(item.unitPrice)}`
    )
    .join("\n");

  return [
    `Нова платена поръчка #${order.orderId}`,
    ``,
    `Родител: ${order.parentName} (${order.parentEmail}${order.parentPhone ? `, тел. ${order.parentPhone}` : ""})`,
    `Обща сума: ${formatPrice(order.totalAmount)}`,
    ``,
    `Поръчани продукти:`,
    rows,
  ].join("\n");
}

/**
 * Notifies the kitchen inbox that a paid order came in, with everything
 * needed to prep it: which child, which item, for which day, and the
 * coupon code as the parent's proof of payment.
 */
export async function sendOrderNotification(order: OrderNotification) {
  const subject = `Нова поръчка от ${order.parentName} — ${formatPrice(order.totalAmount)}`;
  await sendToKitchen(subject, buildEmailBody(order));
}

function buildDailySummaryBody(dateLabel: string, rows: PickupRow[]) {
  if (rows.length === 0) {
    return `Няма платени поръчки за ${dateLabel}.`;
  }

  const bySchool = new Map<string, PickupRow[]>();
  for (const row of rows) {
    const arr = bySchool.get(row.schoolName) ?? [];
    arr.push(row);
    bySchool.set(row.schoolName, arr);
  }

  const sections = [...bySchool.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "bg"))
    .map(([schoolName, schoolRows]) => {
      const sorted = [...schoolRows].sort(
        (a, b) =>
          a.grade.localeCompare(b.grade, "bg") ||
          a.childName.localeCompare(b.childName, "bg")
      );
      const lines = sorted.map(
        (r) => `  • ${r.childName} — ${r.grade} клас — ${r.itemName} — код ${r.couponCode}`
      );
      return [`${schoolName} (${sorted.length}):`, ...lines].join("\n");
    });

  return [
    `Дневно обобщение на поръчките за ${dateLabel}`,
    `Общо деца за проверка: ${rows.length}`,
    ``,
    `При получаване проверявайте детето по код на талона или по име и клас.`,
    ``,
    ...sections,
  ].join("\n\n");
}

/**
 * End-of-day roster for the kitchen: every paid meal scheduled for the
 * given school day, grouped by school and grade so staff can print it
 * and tick children off by pickup code or by name + grade the next
 * morning.
 */
export async function sendDailySummary(dateLabel: string, rows: PickupRow[]) {
  const subject = `Обобщение на поръчките за ${dateLabel} (${rows.length})`;
  await sendToKitchen(subject, buildDailySummaryBody(dateLabel, rows));
}
