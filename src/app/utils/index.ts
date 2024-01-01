import { BudgetQueryData } from "@app/(routing)/trip/[tid]/_types";
import { FocusEvent } from "react";

export const dateformatter = (date: Date) =>
  `${date.getFullYear()}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;

export const dateformatterWithUnit = (date: Date) =>
  `${date.getFullYear()}년 ${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}월 ${date.getDate().toString().padStart(2, "0")}일`;
export const getSumOfBudget = (budget: BudgetQueryData) => {
  const totalExpenses = budget?.expenses?.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const avgExchangeRate =
    budget?.incomes?.reduce((acc, curr) => acc + curr.exchangeRate, 0) /
    budget?.incomes.length;
  return {
    totalIncomes: budget?.incomes?.reduce((acc, curr) => acc + curr.amount, 0),
    totalIncomesKRW: budget?.incomes.reduce(
      (acc, curr) =>
        acc + (curr.amount * curr.exchangeRate) / budget.Currency.amountUnit,
      0
    ),
    totalExpenses: budget?.expenses?.reduce(
      (acc, curr) => acc + curr.amount,
      0
    ),
    totalExpensesKRW:
      totalExpenses * (isNaN(avgExchangeRate) ? 1 : avgExchangeRate),
  };
};
export const onFocusSetCursorPosition = (
  e: FocusEvent<HTMLInputElement, Element>
) => {
  e.target.type = "text";
  e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  e.target.type = "number";
};
