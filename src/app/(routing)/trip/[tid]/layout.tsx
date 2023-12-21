import "@styles/globals.css";
import LOGO from "public/assets/logo_sm.svg";

import Link from "next/link";
import TripInfoModal from "./_components/TripInfoModal";
import TripProvider from "./_components/TripProvider";
import { PropsWithChildren, use } from "react";
import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_TRIP } from "@app/lib/graphql/queries";
import { TripQueryData } from "./_types";

export default function TripLayout({
  children,
  params,
}: PropsWithChildren<{ params: { tid: string; trip: TripQueryData } }>) {
  const { data } = use(
    getClient().query({ query: GET_TRIP, variables: { id: params.tid } })
  );
  return (
    <TripProvider trip={data?.trip}>
      <div>
        <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4 justify-between">
          <Link href={"/home"}>
            <LOGO />
          </Link>
          <TripInfoModal />
        </header>
        {children}
      </div>
    </TripProvider>
  );
}
