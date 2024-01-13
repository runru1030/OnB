import { BudgetQueryData } from "@app/(routing)/trip/[tid]/_types";
import {
  ExpenseQueryData,
  IncomeQueryData,
} from "@app/(routing)/trip/[tid]/detail/_types";
import { FocusEvent, HTMLInputTypeAttribute } from "react";
export const convertUTCtoKST = (date: Date) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  return new Date(utc + KR_TIME_DIFF);
};

export const dateformatter = (date: Date) => {
  const KSTDate = convertUTCtoKST(date);
  return `${KSTDate.getFullYear()}.${(KSTDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${KSTDate.getDate().toString().padStart(2, "0")}`;
};

export const dateformatterWithUnit = (date: Date) => {
  const KSTDate = convertUTCtoKST(date);
  return `${KSTDate.getFullYear()}년 ${(KSTDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}월 ${KSTDate.getDate().toString().padStart(2, "0")}일`;
};
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
    totalExpenses,
    totalExpensesKRW:
      (totalExpenses * budget.exRateAVG) / budget.Currency.amountUnit,
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
