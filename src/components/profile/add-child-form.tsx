"use client";

import { useActionState, useEffect, useRef } from "react";
import { addChild } from "@/actions/children";
import type { FormState } from "@/actions/auth";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SCHOOLS } from "@/lib/schools";
import { Warning } from "@phosphor-icons/react";

const initialState: FormState = { error: null };

export function AddChildForm() {
  const [state, formAction, pending] = useActionState(addChild, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 sm:grid-cols-3">
      <Field label="Име на детето" name="name" required />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          Училище<span className="text-primary"> *</span>
        </span>
        <select
          name="schoolName"
          id="schoolName"
          required
          defaultValue=""
          className="uhd-focus-ring w-full rounded-xl border border-border bg-surface px-4 py-2.75 text-[0.95rem] text-foreground"
        >
          <option value="" disabled>
            Изберете училище
          </option>
          {SCHOOLS.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>
      </label>
      <Field label="Клас" name="grade" required placeholder="3 А" />

      {state.error && (
        <p className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive sm:col-span-3">
          <Warning size={18} className="shrink-0" />
          {state.error}
        </p>
      )}

      <div className="sm:col-span-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Добавяне..." : "Добави дете"}
        </Button>
      </div>
    </form>
  );
}
