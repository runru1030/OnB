"use client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { PropsWithChildren } from "react";

export const ApolloProviders = ({ children }: PropsWithChildren) => {
  const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_DOMAIN}/api/graphql`,
    cache: new InMemoryCache(),
    ssrMode: true,
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
