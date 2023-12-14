export const typeDefs = `#graphql 
  scalar Date
  type Country{
    id:ID!
    name:String
    name_en:String
    flag_img:String
  }
  type Trip{
    id:ID!
    title:String
    startedAt:Date
    endedAt:Date
    countryId:String
    Country:Country
  }
  type Currency{
    id:ID!
    name:String
    countryId:String
  }
  type Expense{
    id:ID!
    category:String
    amount:Int
    usedAt:Date
    budgetId:ID!
  }
  type Income{
    id:ID!
    amount:Int
    exchangeRate:Int
    budgetId:ID!
  }
  type Budget{
    id:ID!
    title:String
    type:String
    Currency:Currency
    expenses:[Expense]
    incomes:[Income]
    totalIncomes:Int
    totalExpenses:Int
  }
  type TripJoined{
    id:ID!
    title:String
    startedAt:Date
    endedAt:Date
    Country:Country
    budgets:[Budget]
    expenses:[Expense]
  }
  type Query {
	  trip(id: ID!): TripJoined 
    trips:[Trip]
    countries:[Country]
    currencies:[Currency]
  }	
  type Mutation {
    createTrip (
    title:String,
    startedAt:Date,
    endedAt:Date,
    countryId:String, 
    userId:ID) : Trip
    createBudget(title:String, type:String, currencyId:String, tripId:ID):Budget
  }

`;
