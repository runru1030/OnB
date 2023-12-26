import { Context } from "@app/api/graphql/route";
import { getSumOfBudget } from "@app/utils";
import { Budget, Expense, Income, Trip, User } from "@prisma/client";

export const resolvers = {
  Query: {
    trip: async (
      _parent: undefined,
      args: { id: string },
      context: Context
    ) => {
      return await context.prisma.trip.findUnique({
        where: {
          id: args.id,
        },
        include: {
          Country: true,
          budgets: {
            include: {
              expenses: {
                include: { Budget: { include: { Currency: true } } },
                orderBy: { createdAt: "desc" },
              },
              incomes: {
                include: { Budget: { include: { Currency: true } } },
                orderBy: { createdAt: "desc" },
              },
              Currency: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    },
    trips: async (
      _parent: undefined,
      args: { userId: string },
      context: Context
    ) => {
      return await context.prisma.trip.findMany({
        where: {
          userId: args.userId,
          endedAt: { gte: new Date() },
        },
        include: {
          Country: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },
    passedTrips: async (
      _parent: undefined,
      args: { userId: string },
      context: Context
    ) => {
      return await context.prisma.trip.findMany({
        where: {
          userId: args.userId,
          endedAt: { lte: new Date() },
        },
        include: {
          Country: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },
    countries: async (
      _parent: undefined,
      args: undefined,
      context: Context
    ) => {
      return await context.prisma.country.findMany({
        orderBy: { name: "asc" },
      });
    },
    currencies: async (
      _parent: undefined,
      args: undefined,
      context: Context
    ) => {
      return await context.prisma.currency.findMany({
        include: { countries: true },
      });
    },
    expenses: async (
      _parent: undefined,
      args: { tid: string },
      context: Context
    ) => {
      return await context.prisma.expense.findMany({
        where: { tripId: args.tid },
        include: { Budget: { include: { Currency: true } } },
        orderBy: { createdAt: "desc" },
      });
    },
    incomes: async (
      _parent: undefined,
      args: { tid: string },
      context: Context
    ) => {
      return await context.prisma.income.findMany({
        where: { tripId: args.tid },
        include: { Budget: { include: { Currency: true } } },
        orderBy: { createdAt: "desc" },
      });
    },
    user: async (
      _parent: undefined,
      args: { email: string },
      context: Context
    ) => {
      return await context.prisma.user.findUnique({
        where: { email: args.email },
      });
    },
    budget: async (
      _parent: undefined,
      args: { id: string },
      context: Context
    ) => {
      return await context.prisma.budget.findUnique({
        where: { id: args.id },
        include: {
          expenses: {
            include: { Budget: { include: { Currency: true } } },
            orderBy: { createdAt: "desc" },
          },
          incomes: {
            include: { Budget: { include: { Currency: true } } },
            orderBy: { createdAt: "desc" },
          },
          Currency: true,
        },
      });
    },
    budgets: async (
      _parent: undefined,
      args: { tid: string },
      context: Context
    ) => {
      return await context.prisma.budget.findMany({
        where: { tripId: args.tid },
        include: {
          expenses: {
            include: { Budget: { include: { Currency: true } } },
            orderBy: { createdAt: "desc" },
          },
          incomes: {
            include: { Budget: { include: { Currency: true } } },
            orderBy: { createdAt: "desc" },
          },
          Currency: true,
        },
        orderBy: { createdAt: "desc" },
      });
    },
    budgetTotal: async (
      _parent: undefined,
      args: { tid: string },
      context: Context
    ) => {
      const budgets = await context.prisma.budget.findMany({
        where: { tripId: args.tid },
        include: {
          expenses: {
            include: { Budget: { include: { Currency: true } } },
            orderBy: { createdAt: "desc" },
          },
          incomes: {
            include: { Budget: { include: { Currency: true } } },
            orderBy: { createdAt: "desc" },
          },
          Currency: true,
        },
        orderBy: { createdAt: "desc" },
      });

      let totalBudgetIncomesKRW = 0;
      let totalBudgetExpenseKRW = 0;
      budgets.forEach((budget) => {
        const { totalExpensesKRW, totalIncomesKRW } = getSumOfBudget(budget);
        totalBudgetExpenseKRW += totalExpensesKRW;
        totalBudgetIncomesKRW += totalIncomesKRW;
      });
      return {
        totalBudgetIncomesKRW,
        totalBudgetExpenseKRW,
        totalBudgetCount: budgets.length,
      };
    },
  },
  Mutation: {
    createTrip: async (_parent: undefined, args: Trip, context: Context) => {
      return await context.prisma.trip.create({
        data: args,
        include: {
          Country: true,
        },
      });
    },
    createBudget: async (
      _parent: undefined,
      args: Budget,
      context: Context
    ) => {
      return await context.prisma.budget.create({
        data: args,
        include: {
          Currency: true,
          expenses: true,
          incomes: true,
        },
      });
    },
    createIncome: async (
      _parent: undefined,
      args: Income,
      context: Context
    ) => {
      return await context.prisma.income.create({
        data: args,
        include: {},
      });
    },
    updateIncome: async (
      _parent: undefined,
      args: Income,
      context: Context
    ) => {
      return await context.prisma.income.update({
        where: { id: args.id },
        data: args,
      });
    },
    updateExpense: async (
      _parent: undefined,
      args: Expense,
      context: Context
    ) => {
      return await context.prisma.expense.update({
        where: { id: args.id },
        data: args,
      });
    },
    createExpense: async (
      _parent: undefined,
      args: Expense,
      context: Context
    ) => {
      return await context.prisma.expense.create({
        data: args,
      });
    },
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
    deleteTrip: async (
      _parent: undefined,
      args: { id: string },
      context: Context
    ) => {
      return await context.prisma.trip.delete({
        where: {
          id: args.id,
        },
      });
    },
    deleteBudget: async (
      _parent: undefined,
      args: { id: string },
      context: Context
    ) => {
      return await context.prisma.budget.delete({
        where: {
          id: args.id,
        },
      });
    },
    deleteIncome: async (
      _parent: undefined,
      args: { id: string },
      context: Context
    ) => {
      return await context.prisma.income.delete({
        where: {
          id: args.id,
        },
      });
    },
    deleteExpense: async (
      _parent: undefined,
      args: { id: string },
      context: Context
    ) => {
      return await context.prisma.expense.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
};
