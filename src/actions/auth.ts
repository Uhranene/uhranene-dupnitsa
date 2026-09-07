"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createParentSession,
  clearParentSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export type FormState = { error: string | null };

const registerSchema = z.object({
  name: z.string().trim().min(2, "Моля, въведете Вашето име."),
  email: z.email("Моля, въведете валиден имейл адрес."),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "Паролата трябва да е поне 6 символа."),
});

export async function registerParent(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Невалидни данни." };
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.parent.findUnique({ where: { email } });
  if (existing) {
    return { error: "Вече има регистрация с този имейл адрес." };
  }

  const parent = await prisma.parent.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: await hashPassword(password),
    },
  });

  await createParentSession(parent.id);
  redirect("/profil");
}

const loginSchema = z.object({
  email: z.email("Моля, въведете валиден имейл адрес."),
  password: z.string().min(1, "Моля, въведете парола."),
});

export async function loginParent(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Невалидни данни." };
  }

  const { email, password } = parsed.data;
  const parent = await prisma.parent.findUnique({ where: { email } });
  if (!parent || !(await verifyPassword(password, parent.passwordHash))) {
    return { error: "Грешен имейл или парола." };
  }

  await createParentSession(parent.id);
  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/") ? next : "/profil");
}

export async function logoutParent() {
  await clearParentSession();
  redirect("/");
}
