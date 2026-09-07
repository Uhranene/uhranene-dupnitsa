import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-medium text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        {children}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {footer}
      </p>
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="uhd-focus-ring rounded font-medium text-primary hover:underline">
      {children}
    </Link>
  );
}
