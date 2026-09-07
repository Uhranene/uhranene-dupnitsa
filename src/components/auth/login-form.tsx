"use client";

import { useActionState } from "react";
import { loginParent, type FormState } from "@/actions/auth";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Warning } from "@phosphor-icons/react";

const initialState: FormState = { error: null };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginParent, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field
        label="Имейл"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <Field
        label="Парола"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      {state.error && (
        <p className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          <Warning size={18} className="shrink-0" />
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Влизане..." : "Вход"}
      </Button>
    </form>
  );
}
