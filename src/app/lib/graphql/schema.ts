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
    amountUnit:Int
    countryId:String
  }
  type Expense{
    id:ID!
    category:String
    amount:Int
    createdAt:Date
    budgetId:ID!
    Budget:Budget
  }
  type Income{
    id:ID!
    exchangeRate:Float
    amount:Int
    createdAt:Date
    budgetId:ID!
    Budget:Budget
  }
  type Budget{
    id:ID!
    title:String
    type:String
    currencyId:String
    Currency:Currency
    expenses:[Expense]
    incomes:[Income]
    totalIncomes:Int
    totalExpenses:Int
    totalIncomesKRW:Int
    totalExpensesKRW:Float
  }
  type TripJoined{
    id:ID!
    title:String
    startedAt:Date
    endedAt:Date
    Country:Country
    budgets:[Budget]
    expenses:[Expense]
    totalBudgetIncomesKRW:Float
    totalBudgetExpenseKRW:Float
  }
  type User{
    id:ID!
    name:String
    email:String!
  }
  type Query {
	  trip(id: ID!): TripJoined 
    trips:[Trip]
    passedTrips:[Trip]
    countries:[Country]
    currencies:[Currency]
    expenses:[Expense]
    incomes:[Income]
    user(email: String!):User
  }	
  type Mutation {
    createTrip (
    title:String,
    startedAt:Date,
    endedAt:Date,
    countryId:String, 
    userId:ID) : Trip
    deleteTrip(id:ID!):Trip

    createBudget(title:String, type:String, currencyId:String, tripId:ID):Budget
    deleteBudget(id:ID!):Budget

    createIncome(amount:Int, exchangeRate:Float, budgetId:ID, tripId:ID):Income
    deleteIncome(id:ID!):Income

    createExpense(category:String, amount:Int, createdAt:Date, budgetId:ID, tripId:ID):Expense
    deleteExpense(id:ID!):Expense

    createAuth(email:String! name:String):User
   
  }

`;
