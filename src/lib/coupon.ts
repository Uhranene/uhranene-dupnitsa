import "server-only";
import { prisma } from "@/lib/prisma";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

function randomSegment(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

/**
 * One code per child, generated once when the child is added — it is
 * reused as the pickup code for every meal they're ever ordered, instead
 * of minting a new one per order.
 */
export async function generateCouponCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = `УХД-${randomSegment(3)}-${randomSegment(3)}`;
    const existing = await prisma.child.findUnique({
      where: { couponCode: code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  throw new Error("Неуспешно генериране на уникален код за талон.");
}
