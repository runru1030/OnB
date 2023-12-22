import "@styles/globals.css";
import LOGO from "public/assets/logo_sm.svg";

import Link from "next/link";
import { PropsWithChildren } from "react";
import TripInfoModal from "./_components/TripInfoModal";
import { TripQueryData } from "./_types";

export default function TripLayout({
  children,
}: PropsWithChildren<{ params: { tid: string; trip: TripQueryData } }>) {
  return (
    <div>
      <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4 justify-between">
        <Link href={"/"}>
          <LOGO />
        </Link>
        <TripInfoModal />
      </header>
      {children}
    </div>
  );
}
