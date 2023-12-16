"use client";

import { PropsWithChildren } from "react";

export default function GlobalProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
