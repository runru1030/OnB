import auth from "./auth";
import budget from "./budget";
import country from "./country";
import currency from "./currency";
import expense from "./expense";
import income from "./income";
import trip from "./trip";

export const resolvers = {
  Query: {
    ...trip.Query,
    ...budget.Query,
    ...expense.Query,
    ...income.Query,
    ...auth.Query,
    ...country.Query,
    ...currency.Query,
  },
  Mutation: {
    ...trip.Mutation,
    ...budget.Mutation,
    ...expense.Mutation,
    ...income.Mutation,
    ...auth.Mutation,
  },
};
