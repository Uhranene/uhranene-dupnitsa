import type { Metadata } from "next";
import {
  ForkKnife,
  CreditCard,
  Ticket,
  ShieldCheck,
  Clock,
  CalendarBlank,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { WEEKDAY_LABEL, WEEKDAY_ORDER } from "@/lib/schedule";

export const metadata: Metadata = {
  title: "Как работи | Ученическо хранене - Дупница",
};

const STEPS = [
  {
    icon: ForkKnife,
    title: "1. Избирате храна от менюто",
    text: "Влизате в раздел „Меню и поръчка“, избирате учебен ден и детето, за което поръчвате, и добавяте закуска, обяд, следобедна закуска или напитка.",
  },
  {
    icon: CreditCard,
    title: "2. Плащате онлайн предварително",
    text: "Плащането се извършва през сайта, преди детето да получи храната — бързо и сигурно.",
  },
  {
    icon: Ticket,
    title: "3. Получавате електронен талон",
    text: "За всеки поръчан продукт се генерира уникален код за талон, който виждате в „Моите поръчки“ веднага след плащане — Вашето потвърждение за платена поръчка.",
  },
  {
    icon: ShieldCheck,
    title: "4. Кухнята получава поръчката веднага",
    text: "Потвърждението и списъкът с поръчаните продукти отиват директно при екипа по хранене, който подготвя всичко за детето Ви на училище.",
  },
];

const SCHEDULE = [
  { time: "08:30 – 09:00", label: "Закуска" },
  { time: "12:00 – 13:00", label: "Обяд" },
  { time: "14:00 – 14:30", label: "Следобедна закуска" },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Как работи
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        От избора на менюто до чинията на детето — целият процес е онлайн и
        прозрачен.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {STEPS.map((step) => (
          <div key={step.title} className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <step.icon size={22} weight="bold" />
            </div>
            <h2 className="mt-4 font-display text-base font-medium text-foreground">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.text}
            </p>
          </div>
        ))}
      </div>

      {/* Weekly schedule */}
      <div className="mt-14">
        <h2 className="font-display text-2xl font-medium text-foreground">
          Седмичен график
        </h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Храна се предлага всеки учебен ден от понеделник до петък,
          в следните часове:
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock size={18} className="text-primary" />
              Часове на хранене
            </p>
            <ul className="mt-4 divide-y divide-border">
              {SCHEDULE.map((s) => (
                <li key={s.label} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium text-foreground">{s.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarBlank size={18} className="text-primary" />
              Учебни дни
            </p>
            <ul className="mt-4 divide-y divide-border">
              {WEEKDAY_ORDER.map((day) => (
                <li key={day} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-muted-foreground">{WEEKDAY_LABEL[day]}</span>
                  <span className="font-medium text-secondary">Работен ден</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 p-5">
          <p className="text-sm font-medium text-foreground">Краен срок за поръчка</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Поръчките за даден учебен ден се приемат до{" "}
            <strong className="font-medium text-foreground">17:00 ч.</strong>{" "}
            предния учебен ден (за поръчки за понеделник — до 17:00 ч. в
            петък), за да може кухнята да подготви необходимите количества. В
            раздел „Меню и поръчка“ винаги виждате само дните, за които все
            още може да се поръчва.
          </p>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface-alt p-6">
        <div className="flex-1">
          <h2 className="font-display text-lg font-medium text-foreground">
            Готови сте да опитате?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Регистрирайте се и направете първата поръчка за детето си.
          </p>
        </div>
        <Button href="/registracia">Регистрация</Button>
      </div>
    </div>
  );
}
