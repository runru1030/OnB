"use client";
import { useAtomValue } from "jotai";
import LOGO from "public/assets/logo_sm.svg";
import { tripAtom } from "./TripProvider";
const PageContent = () => {
  const trip = useAtomValue(tripAtom);
  return (
    <div className="bg-grey-light-300">
      <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4 justify-between">
        <LOGO />
        <h1 className="font-medium">{trip.title}</h1>
      </header>
    </div>
  );
};

export default PageContent;
