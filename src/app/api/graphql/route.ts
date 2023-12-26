import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@app/lib/prisma/db";
import { typeDefs } from "@app/lib/graphql/schemas";
import { resolvers } from "@app/lib/graphql/resolvers";

export type Context = {
  prisma: PrismaClient;
};

const apolloServer = new ApolloServer<Context>({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({ req, res, prisma }),
});
export { handler as GET, handler as POST };
