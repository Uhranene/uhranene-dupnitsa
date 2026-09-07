import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

type SeedItem = {
  name: string;
  description: string;
  price: number;
  category: "BREAKFAST" | "LUNCH" | "SNACK" | "DRINK";
  weekday: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";
  sortOrder: number;
};

const menu: SeedItem[] = [
  // Понеделник
  { name: "Закуска: Тутманик и мляко", description: "Домашен тутманик със сирене и чаша прясно мляко", price: 2.5, category: "BREAKFAST", weekday: "MONDAY", sortOrder: 1 },
  { name: "Пилешка супа с фиде", description: "Лека супа с домашно фиде и моркови", price: 1.8, category: "LUNCH", weekday: "MONDAY", sortOrder: 2 },
  { name: "Задушено телешко с картофи", description: "Основно ястие с гарнитура от картофи и салата", price: 4.9, category: "LUNCH", weekday: "MONDAY", sortOrder: 3 },
  { name: "Плодова закуска", description: "Сезонни плодове, нарязани на парчета", price: 1.5, category: "SNACK", weekday: "MONDAY", sortOrder: 4 },
  { name: "Натурален сок", description: "Домашен сок от ябълка, 200 мл", price: 1.2, category: "DRINK", weekday: "MONDAY", sortOrder: 5 },

  // Вторник
  { name: "Закуска: Банички със сирене", description: "Топла баничка със сирене и кисело мляко", price: 2.3, category: "BREAKFAST", weekday: "TUESDAY", sortOrder: 1 },
  { name: "Леща яхния", description: "Гъста леща яхния с моркови и подправки", price: 1.8, category: "LUNCH", weekday: "TUESDAY", sortOrder: 2 },
  { name: "Пилешко филе на фурна с ориз", description: "Печено пилешко филе с ориз и зеленчуци", price: 4.7, category: "LUNCH", weekday: "TUESDAY", sortOrder: 3 },
  { name: "Кисело мляко с мед", description: "Домашно кисело мляко с лъжичка мед", price: 1.6, category: "SNACK", weekday: "TUESDAY", sortOrder: 4 },
  { name: "Билков чай", description: "Топъл билков чай, без захар", price: 1.0, category: "DRINK", weekday: "TUESDAY", sortOrder: 5 },

  // Сряда
  { name: "Закуска: Кифла с конфитюр", description: "Прясна кифла с домашен конфитюр", price: 2.0, category: "BREAKFAST", weekday: "WEDNESDAY", sortOrder: 1 },
  { name: "Зеленчукова крем супа", description: "Крем супа от сезонни зеленчуци с крутони", price: 1.9, category: "LUNCH", weekday: "WEDNESDAY", sortOrder: 2 },
  { name: "Мусака", description: "Класическа мусака с картофи и кайма", price: 4.8, category: "LUNCH", weekday: "WEDNESDAY", sortOrder: 3 },
  { name: "Плодово смути", description: "Смути от банан и ягода", price: 1.7, category: "SNACK", weekday: "WEDNESDAY", sortOrder: 4 },
  { name: "Минерална вода", description: "Бутилка изворна вода, 500 мл", price: 0.8, category: "DRINK", weekday: "WEDNESDAY", sortOrder: 5 },

  // Четвъртък
  { name: "Закуска: Сандвич с кашкавал", description: "Пълнозърнест сандвич с кашкавал и краставица", price: 2.4, category: "BREAKFAST", weekday: "THURSDAY", sortOrder: 1 },
  { name: "Боб чорба", description: "Гъста боб чорба с чубрица", price: 1.8, category: "LUNCH", weekday: "THURSDAY", sortOrder: 2 },
  { name: "Риба на фурна с картофено пюре", description: "Печена риба с картофено пюре и салата", price: 5.2, category: "LUNCH", weekday: "THURSDAY", sortOrder: 3 },
  { name: "Ядково-плодово барче", description: "Домашно барче с овес, ядки и сушени плодове", price: 1.6, category: "SNACK", weekday: "THURSDAY", sortOrder: 4 },
  { name: "Прясно мляко", description: "Чаша прясно мляко, 200 мл", price: 1.0, category: "DRINK", weekday: "THURSDAY", sortOrder: 5 },

  // Петък
  { name: "Закуска: Козуначена филия", description: "Филия козунак с масло", price: 2.2, category: "BREAKFAST", weekday: "FRIDAY", sortOrder: 1 },
  { name: "Таратор", description: "Студена супа таратор с краставица и копър", price: 1.7, category: "LUNCH", weekday: "FRIDAY", sortOrder: 2 },
  { name: "Пилешки кюфтета с картофи", description: "Домашни кюфтета на фурна с печени картофи", price: 4.6, category: "LUNCH", weekday: "FRIDAY", sortOrder: 3 },
  { name: "Плодова салата", description: "Микс от сезонни плодове", price: 1.5, category: "SNACK", weekday: "FRIDAY", sortOrder: 4 },
  { name: "Прясно изцеден портокалов сок", description: "Натурален сок, 200 мл", price: 1.4, category: "DRINK", weekday: "FRIDAY", sortOrder: 5 },
];

async function main() {
  console.log("Изчистване на съществуващото меню...");
  await prisma.menuItem.deleteMany();

  console.log("Зареждане на демо седмично меню...");
  for (const item of menu) {
    await prisma.menuItem.create({ data: item });
  }

  console.log("Готово.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
