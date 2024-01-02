import { Resolvers } from "@apollo/client";
import { Context } from "@app/api/graphql/route";
import { Income } from "@prisma/client";
export default {
  Query: {
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
  },
  Mutation: {
    createIncome: async (
      _parent: undefined,
      args: Income,
      context: Context
    ) => {
      const [budget, incomeGroup] = await Promise.all([
        context.prisma.budget.findUnique({
          where: { id: args.budgetId },
        }),
        context.prisma.income.groupBy({
          where: { budgetId: args.budgetId },
          by: ["budgetId"],
          _sum: { amount: true },
        }),
      ]);
      const exRateAVG = budget?.exRateAVG || 0;
      const sumAmount = incomeGroup[0]?._sum.amount || 0;

      const callBack = await Promise.all([
        context.prisma.budget.update({
          where: { id: args.budgetId },
          data: {
            exRateAVG:
              (exRateAVG * sumAmount + args.exchangeRate * args.amount) /
              (sumAmount + args.amount),
          },
        }),
        context.prisma.income.create({
          data: args,
        }),
      ]);
      return callBack[1];
    },
    updateIncome: async (
      _parent: undefined,
      args: Income,
      context: Context
    ) => {
      const [budget, incomeGroup, prevIncome] = await Promise.all([
        context.prisma.budget.findUnique({
          where: { id: args.budgetId },
        }),
        context.prisma.income.groupBy({
          where: { budgetId: args.budgetId },
          by: ["budgetId"],
          _sum: { amount: true },
        }),
        context.prisma.income.findUnique({
          where: { id: args.id },
        }),
      ]);
      const exRateAVG = budget?.exRateAVG || 0;
      const sumAmount = incomeGroup[0]?._sum.amount || 0;
      const { exchangeRate, amount } = prevIncome || {
        exchangeRate: 0,
        amount: 0,
      };

      const callBack = await Promise.all([
        context.prisma.budget.update({
          where: { id: args.budgetId },
          data: {
            exRateAVG:
              (exRateAVG * sumAmount -
                exchangeRate * amount +
                args.exchangeRate * args.amount) /
              (sumAmount - amount + args.amount),
          },
        }),
        context.prisma.income.update({
          where: { id: args.id },
          data: args,
        }),
      ]);
      return callBack[1];
    },
    deleteIncome: async (
      _parent: undefined,
      args: { id: string; budgetId: string },
      context: Context
    ) => {
      const [budget, incomeGroup, prevIncome] = await Promise.all([
        context.prisma.budget.findUnique({
          where: { id: args.budgetId },
        }),
        context.prisma.income.groupBy({
          where: { budgetId: args.budgetId },
          by: ["budgetId"],
          _sum: { amount: true },
        }),
        context.prisma.income.findUnique({
          where: { id: args.id },
        }),
      ]);
      const exRateAVG = budget?.exRateAVG || 0;
      const sumAmount = incomeGroup[0]?._sum.amount || 0;
      const { exchangeRate, amount } = prevIncome || {
        exchangeRate: 0,
        amount: 0,
      };
      const callBack = await Promise.all([
        context.prisma.budget.update({
          where: { id: args.budgetId },
          data: {
            exRateAVG:
              (exRateAVG * sumAmount - exchangeRate * amount) /
              (sumAmount - amount),
          },
        }),
        context.prisma.income.delete({
          where: {
            id: args.id,
          },
        }),
      ]);
      return callBack[1];
    },
  },
} as Resolvers;
