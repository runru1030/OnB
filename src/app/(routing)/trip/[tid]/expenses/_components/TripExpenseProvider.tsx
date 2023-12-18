"use client";

import { Expense } from "@prisma/client";
import { Provider, atom, createStore, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren, useEffect } from "react";

export const expensesAtom = atom<Expense[]>([]);
expensesAtom.debugLabel = "expensesAtom";

export const tripExpenseStore = createStore();

export default function TripExpenseProvider({
  children,
  expenses,
}: PropsWithChildren<{ expenses: Expense[] }>) {
  useHydrateAtoms([[expensesAtom, expenses]], {
    store: tripExpenseStore,
  });
  const setexpensesData = useSetAtom(expensesAtom, {
    store: tripExpenseStore,
  });

  useEffect(() => {
    setexpensesData(expenses);
  }, [expenses]);
  return <Provider store={tripExpenseStore}>{children}</Provider>;
}
