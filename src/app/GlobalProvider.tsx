"use client";

import { DevTools } from "jotai-devtools";
import { PropsWithChildren } from "react";

export default function GlobalProvider({ children }: PropsWithChildren) {
  return (
    <>
      {process.env.NODE_ENV === "development" && <DevTools />}
      {children}
    </>
  );
}
