"use client";

import { Expense, Income } from "@prisma/client";
import { Provider, atom, createStore, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren, useEffect } from "react";

export const expensesAtom = atom<Expense[]>([]);
expensesAtom.debugLabel = "expensesAtom";
export const incomesAtom = atom<Income[]>([]);
incomesAtom.debugLabel = "incomesAtom";

export const tripExpenseStore = createStore();

export default function TripDetailProvider({
  children,
  expenses,
  incomes,
}: PropsWithChildren<{ expenses: Expense[]; incomes: Income[] }>) {
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
