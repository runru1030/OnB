import { Resolvers } from "@apollo/client";
import { BudgetQueryData } from "@app/(routing)/trip/[tid]/_types";
import { Context } from "@app/api/graphql/route";
import { getSumOfBudget } from "@app/utils";
import { Budget } from "@prisma/client";

export default {
  Query: {
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
            orderBy: { date: "desc" },
          },
          incomes: {
            include: { Budget: { include: { Currency: true } } },
            orderBy: { date: "desc" },
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
            orderBy: { date: "desc" },
          },
          incomes: {
            include: { Budget: { include: { Currency: true } } },
            orderBy: { date: "desc" },
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
            orderBy: { date: "desc" },
          },
          incomes: {
            include: { Budget: { include: { Currency: true } } },
            orderBy: { date: "desc" },
          },
          Currency: true,
        },
        orderBy: { createdAt: "desc" },
      });

      let totalBudgetIncomesKRW = 0;
      let totalBudgetExpenseKRW = 0;
      budgets.forEach((budget) => {
        const { totalExpensesKRW, totalIncomesKRW } = getSumOfBudget(
          budget as BudgetQueryData
        );
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
    updateBudget: async (
      _parent: undefined,
      args: Budget,
      context: Context
    ) => {
      return await context.prisma.budget.update({
        where: { id: args.id },
        data: args,
        include: {
          Currency: true,
          expenses: true,
          incomes: true,
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
  },
} as Resolvers;
