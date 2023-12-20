import { ApolloProviders } from "@app/_components/ApolloProvider";
import "@styles/globals.css";
import localFont from "next/font/local";
import GlobalProvider from "./_components/GlobalProvider";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AuthProvider from "./_components/AuthProvider";
const pretendard = localFont({
  src: "../../public/font/PretendardVariable.woff2",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={pretendard.className}>
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
