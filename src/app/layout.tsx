import { ApolloProviders } from "@app/_components/ApolloProvider";
import "@styles/globals.css";
import localFont from "next/font/local";
import GlobalProvider from "./_components/GlobalProvider";

import { Session, getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { use } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AuthProvider from "./_components/AuthProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
const pretendard = localFont({
  src: "../../public/font/PretendardVariable.woff2",
  display: "swap",
});
export const metadata = {
  title: "OnB",
  description: "On a Budget : 여행 경비 관리 웹 서비스",
  icons: {
    icon: [
      {
        url: "/assets/logo_sm.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/assets/logo_sm_light.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const headerPathname = headersList.get("x-pathname") || "";
  const session = use(getServerSession(authOptions));
  if (!(session as Session)?.user?.email && headerPathname !== "/login") {
    redirect("/login");
  }
  return (
    <html lang="en" className={pretendard.className}>
      <head>
        <link rel="apple-touch-icon" href="/assets/logo-192x192.png" />
        <meta name="apple-mobile-web-app-title" content="OnB" />
        <link rel="manifest" href="/manifest.json" />
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
