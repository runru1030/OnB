"use client";

import { Provider, atom, createStore, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren, useEffect } from "react";
import { TripQueryData } from "../_types";

export const tripAtom = atom<TripQueryData>({
  id: "",
  title: "",
  startedAt: new Date(),
  endedAt: new Date(),
  Country: { id: "", name: "", name_en: "", flag_img: "" },
  budgets: [],
  expenses: [],
  totalBudgetIncomesKRW: 0,
  totalBudgetExpenseKRW: 0,
});
tripAtom.debugLabel = "tripAtom";

export const tripStore = createStore();

export default function TripProvider({
  children,
  trip,
}: PropsWithChildren<{ trip: TripQueryData }>) {
  useHydrateAtoms([[tripAtom, trip]], {
    store: tripStore,
  });
  const setTripData = useSetAtom(tripAtom, { store: tripStore });

  useEffect(() => {
    setTripData(trip);
  }, [trip]);
  return <Provider store={tripStore}>{children}</Provider>;
}
