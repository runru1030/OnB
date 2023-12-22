import { ApolloProviders } from "@app/_components/ApolloProvider";
import "@styles/globals.css";
import localFont from "next/font/local";
import GlobalProvider from "./_components/GlobalProvider";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AuthProvider from "./_components/AuthProvider";
import { use } from "react";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { GET } from "./api/auth/[...nextauth]/route";
const pretendard = localFont({
  src: "../../public/font/PretendardVariable.woff2",
  display: "swap",
});
export const metadata = {
  title: "OnB",
  description: "On a Budget : 여행 경비 관리 웹 서비스",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const headerPathname = headersList.get("x-pathname") || "";
  const session = use(getServerSession(GET));
  if (!(session as Session)?.user?.email && headerPathname !== "/login") {
    redirect("/login");
  }
  return (
    <html lang="en" className={pretendard.className}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <ApolloProviders>
          <AuthProvider>
            <GlobalProvider>{children}</GlobalProvider>
          </AuthProvider>
        </ApolloProviders>
      </body>
    </html>
  );
}
