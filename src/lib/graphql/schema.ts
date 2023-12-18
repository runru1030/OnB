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
  }
  type Income{
    id:ID!
    amount:Int
    exchangeRate:Float
    budgetId:ID!
    createdAt:Date
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
    totalIncomesKRW:Int
    totalExpensesKRW:Int
  }
  type TripJoined{
    id:ID!
    title:String
    startedAt:Date
    endedAt:Date
    Country:Country
    budgets:[Budget]
    expenses:[Expense]
    totalBudgetIncomesKRW:Int
    totalBudgetExpenseKRW:Int
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
    deleteTrip(id:ID!):Trip

    createBudget(title:String, type:String, currencyId:String, tripId:ID):Budget
    deleteBudget(id:ID!):Budget

    createIncome(amount:Int, exchangeRate:Float, budgetId:ID, tripId:ID):Income
    deleteIncome(id:ID!):Income

    createExpense(category:String, amount:Int, createdAt:Date, budgetId:ID, tripId:ID):Expense
    deleteExpense(id:ID!):Expense
   
  }

`;
