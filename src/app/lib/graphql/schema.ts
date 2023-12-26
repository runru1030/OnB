export const typeDefs = `#graphql 
  scalar Date
  type Country{
    id:ID!
    name:String
    name_en:String
    flag_img:String
    continent:String
    currencyId:ID
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
    countries:[Country]
  }
  type Expense{
    id:ID!
    title:String
    category:String
    amount:Float
    createdAt:Date
    budgetId:ID!
    Budget:Budget
  }
  type Income{
    id:ID!
    title:String
    exchangeRate:Float
    amount:Float
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
  type User{
    id:ID!
    name:String
    email:String!
  }
  type BudgetAgg{
    totalBudgetIncomesKRW:Float
    totalBudgetExpenseKRW:Float
    totalBudgetCount:Int
  }
  type Query {
	  trip(id: ID!): TripJoined 
    trips:[Trip]
    passedTrips:[Trip]
	  budget(id: ID!): Budget 
	  budgets(tid: ID!): [Budget] 
	  budgetTotal(tid: ID!): BudgetAgg 
    countries:[Country]
    currencies:[Currency]
    expenses(tid: ID!):[Expense]
    incomes(tid: ID!):[Income]
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

    createIncome(title:String, amount:Float, exchangeRate:Float, createdAt:Date, budgetId:ID, tripId:ID):Income
    updateIncome(id:ID!, title:String, amount:Float, exchangeRate:Float, createdAt:Date, budgetId:ID, tripId:ID):Income
    deleteIncome(id:ID!):Income

    createExpense(title:String, category:String, amount:Float, createdAt:Date, budgetId:ID, tripId:ID):Expense
    updateExpense(id:ID!, title:String, amount:Float, category:String, createdAt:Date, budgetId:ID, tripId:ID):Expense
    deleteExpense(id:ID!):Expense

    createAuth(email:String! name:String):User
   
  }

`;
