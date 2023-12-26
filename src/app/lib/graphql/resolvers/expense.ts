import { Resolvers } from "@apollo/client";
import { Context } from "@app/api/graphql/route";
import { Expense } from "@prisma/client";
export default {
  Query: {
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
  },
  Mutation: {
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
} as Resolvers;
