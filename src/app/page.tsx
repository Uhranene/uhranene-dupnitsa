import Image from "next/image";
import {
  CalendarCheck,
  CreditCard,
  Ticket,
  ShieldCheck,
  ForkKnife,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { MuralDots } from "@/components/home/mural-dots";
import { prisma } from "@/lib/prisma";
import { WEEKDAY_LABEL } from "@/lib/schedule";
import { formatPrice } from "@/lib/currency";

const STEPS = [
  {
    icon: ForkKnife,
    title: "Избирате от менюто",
    text: "Разглеждате седмичното меню и избирате най-подходящото за вашето дете.",
    tint: "bg-primary/10 text-primary",
  },
  {
    icon: CreditCard,
    title: "Плащате онлайн",
    text: "Плащането се извършва предварително през сайта — бързо и сигурно.",
    tint: "bg-fun-blue/10 text-fun-blue",
  },
  {
    icon: Ticket,
    title: "Получавате талон",
    text: "За всяка поръчка получавате уникален електронен талон с код за детето — Вашето потвърждение за платената храна.",
    tint: "bg-accent/20 text-on-accent",
  },
  {
    icon: ShieldCheck,
    title: "Кухнята вече знае",
    text: "Поръчката пристига веднага при екипа по хранене, който подготвя всичко за детето Ви на училище.",
    tint: "bg-secondary/10 text-secondary",
  },
];

export default async function Home() {
  const preview = await prisma.menuItem.findMany({
    where: { active: true, weekday: "MONDAY", category: "LUNCH" },
    orderBy: { sortOrder: "asc" },
    take: 3,
  });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <MuralDots />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] shadow-xl sm:min-h-[560px] lg:min-h-[620px]">
            <Image
              src="/hero-cafeteria.png"
              alt="Усмихнати деца се хранят здравословно в училищния стол на Ученическо хранене - Дупница"
              fill
              priority
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/92 via-foreground/35 to-transparent" />

            <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-end p-6 sm:min-h-[560px] sm:p-10 lg:min-h-[620px] lg:p-14">
              <span className="inline-flex w-fit items-center rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-on-accent">
                Общинско предприятие · гр. Дупница
              </span>
              <h1 className="mt-5 max-w-2xl font-display text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Топла, здравословна храна за Вашето дете
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/90">
                Изберете от седмичното меню, платете предварително през сайта
                и детето Ви получава храната си в училище.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/menu" size="lg">
                  Разгледай менюто
                  <ArrowRight size={18} weight="bold" />
                </Button>
                <Button href="/kak-raboti" variant="outline-inverse" size="lg">
                  Как работи
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarCheck size={18} className="text-primary" />
              Поръчки за всеки учебен ден
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-secondary" />
              Сигурно плащане онлайн
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-medium text-foreground">
              Как работи
            </h2>
            <p className="mt-3 text-muted-foreground">
              Четири прости стъпки от поръчката до чинията на детето.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${step.tint}`}>
                  <step.icon size={22} weight="bold" />
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Стъпка {i + 1}
                </p>
                <h3 className="mt-1 font-display text-base font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu preview */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-medium text-foreground">
                Примерно меню
              </h2>
              <p className="mt-2 text-muted-foreground">
                Обяд за {WEEKDAY_LABEL.MONDAY.toLowerCase()} — пълното
                седмично меню е в раздел „Меню и поръчка“.
              </p>
            </div>
            <Button href="/menu" variant="outline">
              Пълно меню
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {preview.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <h3 className="font-display text-base font-medium text-foreground">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-4 font-display text-lg font-medium text-primary">
                  {formatPrice(item.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <Image
          src="/school-supplies.png"
          alt=""
          fill
          aria-hidden="true"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/88" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium text-on-primary sm:text-3xl">
              Готови да поръчате храна за детето си?
            </h2>
            <p className="mt-2 max-w-lg text-on-primary/85">
              Регистрирайте се, добавете детето си и направете първата
              поръчка за по-малко от 2 минути.
            </p>
          </div>
          <Button
            href="/registracia"
            variant="inverse"
            size="lg"
            className="shrink-0"
          >
            Регистрация
            <ArrowRight size={18} weight="bold" />
          </Button>
        </div>
      </section>
    </div>
  );
}
