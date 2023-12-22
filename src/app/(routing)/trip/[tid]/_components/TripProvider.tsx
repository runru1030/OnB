"use client";

import { useQuery } from "@apollo/client";
import { GET_TRIP } from "@app/lib/graphql/queries";
import { Provider, atom, createStore, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { TripQueryData } from "../_types";

export const tripAtom = atom<TripQueryData>({
  id: "",
  title: "",
  startedAt: new Date(),
  endedAt: new Date(),
  Country: { id: "", name: "", name_en: "", flag_img: "" },
  budgets: [],
});
tripAtom.debugLabel = "tripAtom";

export const tripStore = createStore();

export default function TripProvider({ children }: PropsWithChildren) {
  const { tid } = useParams();
  const { data } = useQuery(GET_TRIP, { variables: { id: tid } });
  const setTripData = useSetAtom(tripAtom, { store: tripStore });

  useEffect(() => {
    if (data) {
      setTripData(data.trip);
    }
  }, [data]);

  return <Provider store={tripStore}>{children}</Provider>;
}
