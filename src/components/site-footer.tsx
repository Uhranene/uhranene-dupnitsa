import Link from "next/link";
import { MapPin, Phone, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Общинско предприятие за здравословно ученическо хранене в
              гр. Дупница.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-medium text-foreground">
              Разглеждане
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/menu" className="uhd-focus-ring rounded hover:text-primary">
                  Меню и поръчка
                </Link>
              </li>
              <li>
                <Link href="/kak-raboti" className="uhd-focus-ring rounded hover:text-primary">
                  Как работи
                </Link>
              </li>
              <li>
                <Link href="/kontakti" className="uhd-focus-ring rounded hover:text-primary">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-medium text-foreground">
              Родители
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/vhod" className="uhd-focus-ring rounded hover:text-primary">
                  Вход
                </Link>
              </li>
              <li>
                <Link href="/registracia" className="uhd-focus-ring rounded hover:text-primary">
                  Регистрация
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-medium text-foreground">
              Контакти
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>ул. „Николаевска“ 17, гр. Дупница 2600</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>+359 899 876 831</span>
              </li>
              <li className="flex items-start gap-2">
                <EnvelopeSimple size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>uhranene@abv.bg</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ученическо хранене - Дупница ЕООД. Всички права запазени.
        </div>
      </div>
    </footer>
  );
}
