"use client";

import { Provider, atom, createStore } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren } from "react";
import { Trip } from "../_types";

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
  if (trip)
    useHydrateAtoms([[tripAtom, trip]], {
      store: tripStore,
    });

  return <Provider store={tripStore}>{children}</Provider>;
}
