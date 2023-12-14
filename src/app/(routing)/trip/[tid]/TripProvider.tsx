"use client";

import { Budget, Country, Expense } from "@prisma/client";
import { Provider, atom, createStore } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren } from "react";
interface Trip {
  id: string;
  title: String;
  startedAt: Date;
  endedAt: Date;
  Country: Country;
  budgets: Budget[];
  expenses: Expense[];
}
export const tripAtom = atom<Trip>({
  id: "",
  title: "",
  startedAt: new Date(),
  endedAt: new Date(),
  Country: { id: "", name: "", name_en: "", flag_img: "" },
  budgets: [],
  expenses: [],
});
tripAtom.debugLabel = "tripAtom";

export const tripStore = createStore();

export default function TripProvider({
  children,
  trip,
}: PropsWithChildren<{ trip: Trip }>) {
  if (trip) useHydrateAtoms([[tripAtom, trip]], { store: tripStore });

  return <Provider store={tripStore}>{children}</Provider>;
}
