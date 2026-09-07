import type { MealCategory } from "@/generated/prisma";

export const CATEGORY_LABEL: Record<MealCategory, string> = {
  BREAKFAST: "Закуска",
  LUNCH: "Обяд",
  SNACK: "Следобедна закуска",
  DRINK: "Напитка",
};

export const CATEGORY_ORDER: MealCategory[] = [
  "BREAKFAST",
  "LUNCH",
  "SNACK",
  "DRINK",
];
