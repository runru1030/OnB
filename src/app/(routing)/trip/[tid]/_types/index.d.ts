import { Budget, Country, Currency } from "@prisma/client";
import { ExpenseQueryData, IncomeQueryData } from "../detail/_types";

export interface BudgetQueryData extends Budget {
  Currency: Currency;
  incomes: IncomeQueryData[];
  expenses: ExpenseQueryData[];
}
export interface TripQueryData {
  id: string;
  title: string;
  startedAt: Date;
  endedAt: Date;
  Country: Country;
  budgets: BudgetQueryData[];
}
