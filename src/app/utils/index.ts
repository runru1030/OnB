import { BudgetQueryData } from "@app/(routing)/trip/[tid]/_types";

export const dateformatter = (date: Date) =>
  `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;

export const getBudgetsSum = (budget: BudgetQueryData) => {
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
        acc +
        Math.ceil(
          (curr.amount * curr.exchangeRate) / budget.Currency.amountUnit
        ),
      0
    ),
    totalExpenses: budget?.expenses?.reduce(
      (acc, curr) => acc + curr.amount,
      0
    ),
    totalExpensesKRW: totalExpenses * avgExchangeRate,
  };
};
