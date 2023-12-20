"use client";

import { Expense, Income } from "@prisma/client";
import { Provider, atom, createStore, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren, useEffect } from "react";
import { ExpenseQueryData, IncomeQueryData } from "../_types";

export const expensesAtom = atom<ExpenseQueryData[]>([]);
expensesAtom.debugLabel = "expensesAtom";
export const incomesAtom = atom<IncomeQueryData[]>([]);
incomesAtom.debugLabel = "incomesAtom";

export const tripExpenseStore = createStore();

export default function TripDetailProvider({
  children,
  expenses,
  incomes,
}: PropsWithChildren<{
  expenses: ExpenseQueryData[];
  incomes: IncomeQueryData[];
}>) {
  useHydrateAtoms(
    [
      [expensesAtom, expenses],
      [incomesAtom, incomes],
    ],
    {
      store: tripExpenseStore,
    }
  );

  const setexpensesData = useSetAtom(expensesAtom, {
    store: tripExpenseStore,
  });
  const setIncomesData = useSetAtom(incomesAtom, {
    store: tripExpenseStore,
  });

  useEffect(() => {
    setexpensesData(expenses);
  }, [expenses]);
  useEffect(() => {
    setIncomesData(incomes);
  }, [incomes]);

  return <Provider store={tripExpenseStore}>{children}</Provider>;
}
