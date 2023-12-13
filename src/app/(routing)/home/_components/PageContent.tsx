"use client";
import { useAtomValue } from "jotai";
import { myTripsAtom } from "./MyTripProvider";
import { TripQueryData } from "../_types";
import TripBox from "./TripBox";
import CreateTripModal from "./CreateTripModal";
import LOGO from "public/assets/logo_sm.svg";
const PageContent = () => {
  const myTrips = useAtomValue(myTripsAtom);
  return (
    <div>
      <header className="h-[52px] flex items-center justify-center">
        <LOGO />
      </header>
      <div className="w-full flex flex-col gap-4 px-4">
        {myTrips?.map((trip: TripQueryData) => (
          <TripBox key={trip.id} {...{ ...trip }} />
        ))}
        <CreateTripModal />
      </div>
    </div>
  );
};

export default PageContent;
