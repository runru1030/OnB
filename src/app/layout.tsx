// import { Providers } from "@components/ApolloProvider";
import "@styles/globals.css";
import localFont from "next/font/local";
import GlobalProvider from "./GlobalProvider";
import { ApolloProviders } from "@app/_components/ApolloProvider";

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
      <head />
      <body>
        <ApolloProviders>
          <GlobalProvider>{children}</GlobalProvider>
        </ApolloProviders>
      </body>
    </html>
  );
}
