import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDailySummary, type PickupRow } from "@/lib/email";
import { getNextSchoolDay, dateKey } from "@/lib/schedule";

/**
 * Meant to be hit once a day, after parents are done ordering (e.g. via
 * a free cron service like cron-job.org), so the kitchen gets a printable
 * roster of every paid meal for the next school day. Protected by
 * CRON_SECRET so it can't be triggered by randoms — set that env var and
 * pass it back as `?secret=` or an `Authorization: Bearer` header.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const provided = header || request.nextUrl.searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const dateParam = request.nextUrl.searchParams.get("date");
  const target = dateParam ? new Date(`${dateParam}T00:00:00`) : getNextSchoolDay();
  const start = new Date(target);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const items = await prisma.orderItem.findMany({
    where: { mealDate: { gte: start, lt: end } },
    include: { child: true, menuItem: true },
  });

  const rows: PickupRow[] = items.map((item) => ({
    childName: item.child.name,
    grade: item.child.grade,
    schoolName: item.child.schoolName,
    couponCode: item.child.couponCode,
    itemName: item.menuItem.name,
  }));

  const dateLabel = start.toLocaleDateString("bg-BG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  await sendDailySummary(dateLabel, rows);

  return NextResponse.json({ ok: true, date: dateKey(start), childrenCount: rows.length });
}
