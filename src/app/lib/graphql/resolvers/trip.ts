import { Resolvers } from "@apollo/client";
import { Context } from "@app/api/graphql/route";
import { Trip } from "@prisma/client";

export default {
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
  },
} as Resolvers;
