import Link from "next/link";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { logoutParent } from "@/actions/auth";

const TABS = [
  { href: "/profil", label: "Профил" },
  { href: "/profil/deca", label: "Моите деца" },
  { href: "/profil/porachki", label: "Моите поръчки" },
];

export default function ProfileLayout({ children }: LayoutProps<"/profil">) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <nav className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="uhd-focus-ring rounded-full px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <form action={logoutParent}>
          <button
            type="submit"
            className="uhd-focus-ring flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-destructive"
          >
            <SignOut size={16} />
            Изход
          </button>
        </form>
      </div>
      <div className="py-8">{children}</div>
    </div>
  );
}
