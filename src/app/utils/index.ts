import { BudgetQueryData } from "@app/(routing)/trip/[tid]/_types";
import {
  ExpenseQueryData,
  IncomeQueryData,
} from "@app/(routing)/trip/[tid]/detail/_types";
import { FocusEvent, HTMLInputTypeAttribute } from "react";

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
    totalExpensesKRW: totalExpenses * budget.exRateAVG,
  };
};
export const getSumOfDetail = (
  detailDataList: (IncomeQueryData | ExpenseQueryData)[]
) => {
  const totalExpensesObj = {} as { [key: string]: number };
  let totalExpensesKRW = 0;
  detailDataList.forEach((detail) => {
    if (Object.hasOwn(detail, "category")) {
      if (!totalExpensesObj[detail.Budget.Currency.id]) {
        totalExpensesObj[detail.Budget.Currency.id] = 0;
      }
      totalExpensesObj[detail.Budget.Currency.id] += detail.amount;
      totalExpensesKRW +=
        (detail.amount * detail.Budget.exRateAVG) /
        detail.Budget.Currency.amountUnit;
    }
  });
  return {
    totalExpensesObj,
    totalExpensesKRW,
  };
};
export const onFocusSetCursorPosition = (
  e: FocusEvent<HTMLInputElement, Element>,
  originType: HTMLInputTypeAttribute
) => {
  e.target.type = "text";
  e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  e.target.type = originType;
};
