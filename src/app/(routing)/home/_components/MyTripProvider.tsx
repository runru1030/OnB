"use client";

import { Provider, atom, createStore } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren } from "react";
import { TripQueryData } from "../_types";

export const myTripsAtom = atom<TripQueryData[]>([]);
myTripsAtom.debugLabel = "myTripsAtom";

export const myTripStore = createStore();
export default function MyTripProvider({
  children,
  myTrips,
}: PropsWithChildren<{ myTrips: TripQueryData[] }>) {
  if (myTrips)
    useHydrateAtoms([[myTripsAtom, myTrips]], { store: myTripStore });

  return <Provider store={myTripStore}>{children}</Provider>;
}
