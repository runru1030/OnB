import { Resolvers } from "@apollo/client";
import { Context } from "@app/api/graphql/route";
import { User } from "@prisma/client";
export default {
  Query: {
    user: async (
      _parent: undefined,
      args: { email: string },
      context: Context
    ) => {
      return await context.prisma.user.findUnique({
        where: { email: args.email },
      });
    },
  },
  Mutation: {
    createAuth: async (_parent: undefined, args: User, context: Context) => {
      return await context.prisma.user.upsert({
        where: { email: args.email },
        update: {},
        create: {
          email: args.email,
          name: args.name || "",
        },
      });
    },
  },
} as Resolvers;
