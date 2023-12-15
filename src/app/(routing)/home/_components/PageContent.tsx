"use client";
import LOGO from "public/assets/logo_sm.svg";
import { useMemo } from "react";
import { MyTripQueryData } from "../_types";
import CreateTripModal from "./CreateTripModal";
import TripBox from "./TripBox";
const PageContent = ({ myTrips }: { myTrips: MyTripQueryData[] }) => {
  const nonePassedTrips = useMemo(
    () =>
      myTrips?.filter(
        (trip) => new Date(trip.endedAt).getTime() >= new Date().getTime()
      ),
    [myTrips]
  );
  const passedTrips = useMemo(
    () =>
      myTrips?.filter(
        (trip) => new Date(trip.endedAt).getTime() < new Date().getTime()
      ),
    [myTrips]
  );
  return (
    <div className="bg-grey-light-300">
      <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4">
        <LOGO />
      </header>
      <div className="main-content">
        <div className="flex flex-col bg-white rounded-xl p-3 border border-grey-light-400 gap-3">
          <h2 className="text-lg font-medium">내 여행</h2>
          <CreateTripModal />
          {nonePassedTrips.map((trip: MyTripQueryData) => (
            <TripBox key={trip.id} {...{ ...trip }} />
          ))}

          {nonePassedTrips.length === 0 && (
            <div className="bg-grey-light-300 border border-grey-light-400 flex h-[160px] justify-center items-center rounded-2xl text-grey-300">
              예정된 여행이 없군요! <br />
              여행을 만들어 보세요!
            </div>
          )}
        </div>
        <div className="flex flex-col bg-white rounded-xl p-3 border border-grey-light-400 gap-3">
          <h2 className="text-lg font-medium text-grey-300">지난 여행</h2>
          {passedTrips.map((trip: MyTripQueryData) => (
            <TripBox key={trip.id} {...{ ...trip }} />
          ))}
          {passedTrips.length === 0 && (
            <div className="bg-grey-light-300 border border-grey-light-400 flex h-[160px] justify-center items-center rounded-2xl text-grey-300">
              아직 지난 여행이 없군요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageContent;
