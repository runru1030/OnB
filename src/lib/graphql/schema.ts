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
  }
  type Expense{
    id:ID!
    category:String
    amount:Int
    usedAt:Date
    budgetId:ID!
  }
  type Budget{
    id:ID!
    type:String
    amount:Int
    Currency:Currency
    expenses:[Expense]
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
  }	
  type Mutation {
    createTrip (
    title:String,
    startedAt:Date,
    endedAt:Date,
    countryId:String, 
    userId:ID) : Trip
  }

`;
