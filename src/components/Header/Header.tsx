"use client";
import { PropsWithChildren } from "react";

import Link from "next/link";
import LOGO from "public/assets/logo_sm.svg";

export const HeaderWithLogo = ({ children }: PropsWithChildren) => {
  return (
    <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4 justify-between">
      <Link href={"/"}>
        <LOGO />
      </Link>
      {children}
    </header>
  );
};

const InternalHeader = ({ children }: PropsWithChildren) => {
  return (
    <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4 justify-between">
      {children}
    </header>
  );
};
InternalHeader.WithLogo = HeaderWithLogo;
export default InternalHeader;
