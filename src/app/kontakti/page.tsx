import type { Metadata } from "next";
import { MapPin, Phone, EnvelopeSimple, Clock } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = { title: "Контакти | Ученическо хранене - Дупница" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Контакти
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        „Ученическо хранене - Дупница“ ЕООД е общинско предприятие на
        Община Дупница за здравословно хранене на учениците.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-surface p-5">
            <MapPin size={20} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Адрес на управление</p>
              <p className="mt-1 text-sm text-muted-foreground">
                ул. „Николаевска“ 17, гр. Дупница 2600, България
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-surface p-5">
            <Phone size={20} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Телефон</p>
              <p className="mt-1 text-sm text-muted-foreground">+359 899 876 831</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-surface p-5">
            <EnvelopeSimple size={20} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Имейл</p>
              <p className="mt-1 text-sm text-muted-foreground">
                uhranene@abv.bg
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-surface p-5">
            <Clock size={20} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Работно време на офиса</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Понеделник – петък, 08:00 – 16:30 ч.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <iframe
            title="Карта - гр. Дупница"
            src="https://www.openstreetmap.org/export/embed.html?bbox=23.1180%2C42.2540%2C23.1580%2C42.2800&layer=mapnik&marker=42.2670%2C23.1380"
            className="h-72 w-full grayscale-[15%] sm:h-full sm:min-h-[320px]"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface-alt p-6 text-sm text-muted-foreground">
        <p>
          ЕИК: 202723201 · Едноличен собственик на капитала: Община Дупница
        </p>
      </div>
    </div>
  );
}
