"use client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export const ApolloProviders = ({ children }: { children: any }) => {
  const client = new ApolloClient({
    uri: "http://localhost:3000/api/graphql",
    cache: new InMemoryCache(),
    ssrMode: true,
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
