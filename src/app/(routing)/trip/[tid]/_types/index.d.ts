import { Budget, Country, Currency, Expense, Income } from "@prisma/client";

export interface extendedBudget extends Budget {
  Currency: Currency;
  incomes: Income[];
  expenses: Expense[];
  totalIncomes: number;
  totalExpenses: number;
}
export interface Trip {
  id: string;
  title: String;
  startedAt: Date;
  endedAt: Date;
  Country: Country;
  budgets: extendedBudget[];
  expenses: Expense[];
}
