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
  },
} as Resolvers;
