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
            include: {
              expenses: {
                include: { Budget: true },
                orderBy: { createdAt: "desc" },
              },
              incomes: {
                include: { Budget: true },
                orderBy: { createdAt: "desc" },
              },
              Currency: true,
            },
            orderBy: { createdAt: "desc" },
          },
          expenses: true,
        },
      });
      const aggregationBudget = trip?.budgets.map((budget) => {
        const totalIncomes = budget.incomes.reduce(
          (acc, curr) => acc + curr.amount,
          0
        );
        const totalIncomesKRW = budget.incomes.reduce(
          (acc, curr) => acc + Math.ceil(curr.amount * curr.exchangeRate),
          0
        );
        const totalExpenses = budget.expenses.reduce(
          (acc, curr) => acc + curr.amount,
          0
        );
        const avgExchangeRate = isNaN(totalIncomesKRW / totalIncomes)
          ? 0
          : totalIncomesKRW / totalIncomes;
        return {
          ...budget,
          totalIncomes,
          totalIncomesKRW,
          totalExpenses,
          totalExpensesKRW: totalExpenses * avgExchangeRate,
        };
      });
      const totalBudgetIncomesKRW = aggregationBudget?.reduce(
        (acc, curr) => acc + curr.totalIncomesKRW,
        0
      );
      const totalBudgetExpenseKRW = aggregationBudget?.reduce(
        (acc, curr) => acc + curr.totalExpensesKRW,
        0
      );
      return {
        ...trip,
        budgets: aggregationBudget,
        totalBudgetIncomesKRW,
        totalBudgetExpenseKRW,
      };
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
    expenses: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.expense.findMany({
        where: { tripId: args.tripId },
        include: { Budget: { include: { Currency: true } } },
        orderBy: { createdAt: "desc" },
      });
    },
    incomes: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.income.findMany({
        where: { tripId: args.tripId },
        include: { Budget: { include: { Currency: true } } },
        orderBy: { createdAt: "desc" },
      });
    },
    user: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.user.findUnique({
        where: { email: args.email },
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
    createIncome: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.income.create({
        data: {
          amount: args.amount,
          exchangeRate: args.exchangeRate,
          budgetId: args.budgetId,
          tripId: args.tripId,
        },
        include: {},
      });
    },
    createExpense: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.expense.create({
        data: {
          category: args.category,
          amount: args.amount,
          createdAt: args.createdAt,
          budgetId: args.budgetId,
          tripId: args.tripId,
        },
      });
    },
    createAuth: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.user.upsert({
        where: { email: args.email },
        update: {},
        create: {
          email: args.email,
          name: args.name || "",
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
    deleteIncome: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.income.delete({
        where: {
          id: args.id,
        },
      });
    },
    deleteExpense: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.expense.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
};
