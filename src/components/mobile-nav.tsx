"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X, User } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type Link_ = { href: string; label: string };

export function MobileNav({
  links,
  isLoggedIn,
  firstName,
}: {
  links: Link_[];
  isLoggedIn: boolean;
  firstName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Затвори менюто" : "Отвори менюто"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="uhd-focus-ring flex h-11 w-11 items-center justify-center rounded-full text-foreground"
      >
        {open ? <X size={24} /> : <List size={24} />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[65px] z-50 border-b border-border bg-surface px-4 py-5 shadow-lg">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="uhd-focus-ring rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {isLoggedIn ? (
              <Button
                href="/profil"
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <User size={18} weight="bold" />
                {firstName ? `Профил (${firstName})` : "Моят профил"}
              </Button>
            ) : (
              <>
                <Button
                  href="/vhod"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Вход
                </Button>
                <Button
                  href="/registracia"
                  variant="primary"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
