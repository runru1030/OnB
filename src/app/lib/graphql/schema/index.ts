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
  type Currency{
    id:ID!
    name:String
    amountUnit:Int
    countries:[Country]
  }
  type Trip{
    id:ID!
    title:String
    startedAt:Date
    endedAt:Date
    countryId:String
    Country:Country
  }
  type Expense{
    id:ID!
    title:String
    category:String
    amount:Float
    date:Date
    createdAt:Date
    budgetId:ID!
    Budget:Budget
  }
  input ExpenseInput{
    title:String
    category:String
    amount:Float
    date:Date
    createdAt:Date
    tripId:ID!
    budgetId:ID!
  }
  type Income{
    id:ID!
    title:String
    exchangeRate:Float
    amount:Float
    date:Date
    createdAt:Date
    budgetId:ID!
    Budget:Budget
  }
  input IncomeInput{
    title:String
    exchangeRate:Float
    amount:Float
    date:Date
    budgetId:ID!
    tripId:ID!
  }
  type Budget{
    id:ID!
    title:String
    type:String
    exRateAVG:Float
    currencyId:String
    Currency:Currency
    expenses:[Expense]
    incomes:[Income]
  }
  type User{
    id:ID!
    name:String
    email:String!
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
  type BudgetAgg{
    totalBudgetIncomesKRW:Float
    totalBudgetExpenseKRW:Float
    totalBudgetCount:Int
  }
  type Query {
	  trip(id: ID!): TripJoined 
    trips(userId: ID!):[Trip]
    passedTrips(userId: ID!):[Trip]
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
    createTrip (title:String,startedAt:Date,endedAt:Date,countryId:String, userId:ID) : Trip
    deleteTrip(id:ID!):Trip

    createBudget(title:String, type:String, currencyId:String, tripId:ID):Budget
    updateBudget(id:ID!, title:String, type:String):Budget
    deleteBudget(id:ID!):Budget

    createIncome(title:String, amount:Float, exchangeRate:Float, date:Date, budgetId:ID, tripId:ID):Income
    createIncomes(incomes:[IncomeInput]):Income
    updateIncome(id:ID!, title:String, amount:Float, exchangeRate:Float, date:Date, budgetId:ID, tripId:ID):Income
    deleteIncome(id:ID!, budgetId:ID!):Income

    createExpense(title:String, category:String, amount:Float, date:Date, budgetId:ID, tripId:ID):Expense
    createExpenses(expenses:[ExpenseInput]):Expense
    updateExpense(id:ID!, title:String, amount:Float, category:String, date:Date, budgetId:ID, tripId:ID):Expense
    deleteExpense(id:ID!):Expense

    createAuth(email:String! name:String):User
   
  }

`;
