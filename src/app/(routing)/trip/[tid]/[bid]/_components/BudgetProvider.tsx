"use client";

import { Provider, atom, createStore } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren } from "react";
import { BudgetQueryData } from "../../_types";

export const budgetAtom = atom<BudgetQueryData>({
  id: "",
  title: "",
  Currency: {
    id: "",
    name: "",
    amountUnit: 1,
  },
  incomes: [],
  expenses: [],
  type: "",
  tripId: "",
  currencyId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const budgetStore = createStore();

export default function BudgetProvider({
  children,
  budget,
}: PropsWithChildren<{ budget: BudgetQueryData }>) {
  useHydrateAtoms([[budgetAtom, budget]], { store: budgetStore });

  return <Provider store={budgetStore}>{children}</Provider>;
}
