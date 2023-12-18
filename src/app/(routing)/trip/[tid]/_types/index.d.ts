import { Budget, Country, Currency, Expense, Income } from "@prisma/client";

export interface BudgetQueryData extends Budget {
  Currency: Currency;
  incomes: Income[];
  expenses: Expense[];
  totalIncomes: number;
  totalExpenses: number;
  totalIncomesKRW: number;
  totalExpensesKRW: number;
}
export interface TripQueryData {
  id: string;
  title: String;
  startedAt: Date;
  endedAt: Date;
  Country: Country;
  budgets: BudgetQueryData[];
  expenses: Expense[];
  totalBudgetIncomesKRW: number;
  totalBudgetExpenseKRW: number;
}
