"use client";

import { useActionState } from "react";
import { registerParent, type FormState } from "@/actions/auth";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Warning } from "@phosphor-icons/react";

const initialState: FormState = { error: null };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerParent,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Име и фамилия" name="name" autoComplete="name" required />
      <Field
        label="Имейл"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <Field
        label="Телефон"
        name="phone"
        type="tel"
        autoComplete="tel"
        hint="По желание — за връзка при нужда."
      />
      <Field
        label="Парола"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="Поне 6 символа."
      />

      {state.error && (
        <p className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          <Warning size={18} className="shrink-0" />
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Регистрация..." : "Регистрация"}
      </Button>
    </form>
  );
}
