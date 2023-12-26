import { Resolvers } from "@apollo/client";
import { Context } from "@app/api/graphql/route";
export default {
  Query: {
    currencies: async (
      _parent: undefined,
      args: undefined,
      context: Context
    ) => {
      return await context.prisma.currency.findMany({
        include: { countries: true },
      });
    },
  },
} as Resolvers;
