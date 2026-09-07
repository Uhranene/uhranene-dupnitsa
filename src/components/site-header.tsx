import Link from "next/link";
import { User } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getParentId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MobileNav } from "@/components/mobile-nav";
import { CartBadge } from "@/components/cart/cart-badge";

const NAV_LINKS = [
  { href: "/menu", label: "Меню и поръчка" },
  { href: "/kak-raboti", label: "Как работи" },
  { href: "/kontakti", label: "Контакти" },
];

export async function SiteHeader() {
  const parentId = await getParentId();
  const parent = parentId
    ? await prisma.parent.findUnique({
        where: { id: parentId },
        select: { name: true },
      })
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="uhd-focus-ring uhd-logo-link rounded-lg">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="uhd-focus-ring rounded text-[0.95rem] font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <CartBadge />
          {parent ? (
            <Button href="/profil" variant="outline" size="sm">
              <User size={18} weight="bold" />
              {parent.name.split(" ")[0]}
            </Button>
          ) : (
            <>
              <Button href="/vhod" variant="ghost" size="sm">
                Вход
              </Button>
              <Button href="/registracia" variant="primary" size="sm">
                Регистрация
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <CartBadge />
          <MobileNav
            links={NAV_LINKS}
            isLoggedIn={Boolean(parent)}
            firstName={parent?.name.split(" ")[0]}
          />
        </div>
      </div>
    </header>
  );
}
