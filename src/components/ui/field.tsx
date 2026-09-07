import type { InputHTMLAttributes } from "react";

export function Field({
  label,
  name,
  hint,
  ...props
}: {
  label: string;
  name: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {props.required && <span className="text-primary"> *</span>}
      </span>
      <input
        name={name}
        id={name}
        className="uhd-focus-ring w-full rounded-xl border border-border bg-surface px-4 py-2.75 text-[0.95rem] text-foreground placeholder:text-muted-foreground/70"
        {...props}
      />
      {hint && (
        <span className="mt-1.5 block text-xs text-muted-foreground">
          {hint}
        </span>
      )}
    </label>
  );
}
