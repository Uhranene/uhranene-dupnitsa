export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="20" fill="var(--color-primary)" />
      <path
        d="M12 12v8a4 4 0 0 0 4 4v6"
        stroke="var(--color-on-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12v6M15 12v6"
        stroke="var(--color-on-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27 12c-2.2 0-3.5 2-3.5 5s1.3 5 3.5 5v8"
        stroke="var(--color-on-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="uhd-logo-mark h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-tight">
        <span className="font-display text-[0.95rem] font-medium tracking-tight text-foreground">
          Ученическо хранене
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Дупница
        </span>
      </span>
    </span>
  );
}
