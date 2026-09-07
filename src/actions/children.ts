"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getParentId } from "@/lib/auth";
import { generateCouponCode } from "@/lib/coupon";
import { SCHOOLS } from "@/lib/schools";
import type { FormState } from "@/actions/auth";

const childSchema = z.object({
  name: z.string().trim().min(2, "Моля, въведете името на детето."),
  schoolName: z.enum(SCHOOLS, "Моля, изберете училище."),
  grade: z.string().trim().min(1, "Моля, въведете клас."),
});

export async function addChild(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parentId = await getParentId();
  if (!parentId) return { error: "Моля, влезте в профила си." };

  const parsed = childSchema.safeParse({
    name: formData.get("name"),
    schoolName: formData.get("schoolName"),
    grade: formData.get("grade"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Невалидни данни." };
  }

  const couponCode = await generateCouponCode();
  await prisma.child.create({
    data: { ...parsed.data, parentId, couponCode },
  });

  revalidatePath("/profil/deca");
  revalidatePath("/menu");
  return { error: null };
}

export async function removeChild(childId: string) {
  const parentId = await getParentId();
  if (!parentId) return;

  await prisma.child.deleteMany({ where: { id: childId, parentId } });
  revalidatePath("/profil/deca");
  revalidatePath("/menu");
}
