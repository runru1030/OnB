import { Expense, Income } from "@prisma/client";
import { BudgetQueryData } from "../../_types";

export interface IncomeQueryData extends Income {
  Budget: BudgetQueryData;
}
export interface ExpenseQueryData extends Expense {
  Budget: BudgetQueryData;
}
