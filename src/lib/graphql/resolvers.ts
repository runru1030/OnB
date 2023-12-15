import { Context } from "@api/graphql";

export const resolvers = {
  Query: {
    trip: async (_parent: any, args: any, context: Context) => {
      const trip = await context.prisma.trip.findUnique({
        where: {
          id: args.id,
        },
        include: {
          Country: true,
          budgets: {
            include: { expenses: true, incomes: true, Currency: true },
            orderBy: { createdAt: "desc" },
          },
          expenses: true,
        },
      });
      const aggregationTrip = trip?.budgets.map((budget) => ({
        ...budget,
        totalIncomes: budget.incomes.reduce(
          (acc, curr) => acc + curr.amount,
          0
        ),
        totalExpenses: budget.expenses.reduce(
          (acc, curr) => acc + curr.amount,
          0
        ),
      }));
      return { ...trip, budgets: aggregationTrip };
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
    currencies: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.currency.findMany();
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
    createBudget: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.budget.create({
        data: {
          title: args.title,
          type: args.type,
          currencyId: args.currencyId,
          tripId: args.tripId,
        },
        include: {
          Currency: true,
          expenses: true,
          incomes: true,
        },
      });
    },
    deleteTrip: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.trip.delete({
        where: {
          id: args.id,
        },
      });
    },
    deleteBudget: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.budget.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
};
