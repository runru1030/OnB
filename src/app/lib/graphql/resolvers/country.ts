import { Resolvers } from "@apollo/client";
import { Context } from "@app/api/graphql/route";
export default {
  Query: {
    countries: async (
      _parent: undefined,
      args: undefined,
      context: Context
    ) => {
      return await context.prisma.country.findMany({
        orderBy: { name: "asc" },
      });
    },
  },
} as Resolvers;
