import { Context } from "@api/graphql";

export const resolvers = {
  Query: {
    trip: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.trip.findUnique({
        where: {
          id: args.id,
        },
        include: {
          Country: true,
          budgets: { include: { expenses: true } },
          expenses: true,
        },
      });
    },
    trips: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.trip.findMany({
        where: {
          userId: args.userId,
        },
        include: {
          Country: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },
    countries: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.country.findMany({
        orderBy: { name: "asc" },
      });
    },
  },
  Mutation: {
    createTrip: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.trip.create({
        data: {
          title: args.title,
          startedAt: args.startedAt,
          endedAt: args.endedAt,
          countryId: args.countryId,
          userId: args.userId,
        },
        include: {
          Country: true,
        },
      });
    },
  },
};
