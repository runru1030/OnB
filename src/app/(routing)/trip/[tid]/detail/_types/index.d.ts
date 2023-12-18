import { Budget, Expense, Income } from "@prisma/client";

export interface IncomeQueryData extends Income {
  Budget: Budget;
}
export interface ExpenseQueryData extends Expense {
  Budget: Budget;
}
