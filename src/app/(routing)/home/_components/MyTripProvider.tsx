"use client";

import { Provider, atom, createStore, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { PropsWithChildren, useEffect } from "react";
import { MyTripQueryData } from "../_types";

export const myTripsAtom = atom<MyTripQueryData[]>([]);
myTripsAtom.debugLabel = "myTripsAtom";

export const myTripStore = createStore();
export default function MyTripProvider({
  children,
  myTrips,
}: PropsWithChildren<{ myTrips: MyTripQueryData[] }>) {
  useHydrateAtoms([[myTripsAtom, myTrips]], { store: myTripStore });

  const setMyTripsData = useSetAtom(myTripsAtom, { store: myTripStore });
  useEffect(() => {
    setMyTripsData(myTrips);
  }, [myTrips]);

  const setMyTripsData = useSetAtom(myTripsAtom, { store: myTripStore });
  useEffect(() => {
    setMyTripsData(myTrips);
  }, [myTrips]);

  return <Provider store={myTripStore}>{children}</Provider>;
}
