import { gql } from "apollo-server-micro";
import { DocumentNode } from "graphql";

const CREATE_BUDGET = gql`
  mutation CreateBudget(
    $title: String
    $currencyId: String
    $type: String
    $tripId: ID
  ) {
    createBudget(
      title: $title
      type: $type
      currencyId: $currencyId
      tripId: $tripId
    ) {
      id
      title
      type
      Currency {
        id
        name
        amountUnit
      }
      expenses {
        amount
      }
      incomes {
        amount
        exchangeRate
      }
    }
  }
`;

const DELETE_BUDGET = gql`
  mutation DeleteBudget($id: ID!) {
    deleteBudget(id: $id) {
      id
    }
  }
`;
const GET_BUDGET = gql`
  query Budget($id: ID!) {
    budget(id: $id) {
      id
      type
      title
      Currency {
        id
        name
        amountUnit
      }
      expenses {
        id
        title
        category
        amount
        createdAt
        budgetId
        Budget {
          title
          type
          Currency {
            id
            amountUnit
          }
        }
      }
      incomes {
        id
        title
        amount
        exchangeRate
        createdAt
        budgetId
        Budget {
          title
          type
          Currency {
            id
            amountUnit
          }
        }
      }
    }
  }
`;

const GET_BUDGETS = gql`
  query Budgets($tid: ID!) {
    budgets(tid: $tid) {
      id
      type
      title
      Currency {
        id
        name
        amountUnit
      }
      expenses {
        id
        title
        category
        amount
        createdAt
        budgetId
        Budget {
          title
          Currency {
            id
            amountUnit
          }
        }
      }
      incomes {
        id
        title
        amount
        exchangeRate
        createdAt
        budgetId
        Budget {
          title
          type
          Currency {
            id
            amountUnit
          }
        }
      }
    }
  }
`;

const GET_BUDGET_TOTAL = gql`
  query BudgetTotal($tid: ID!) {
    budgetTotal(tid: $tid) {
      totalBudgetIncomesKRW
      totalBudgetExpenseKRW
      totalBudgetCount
    }
  }
`;

export default {
  GET_BUDGET,
  GET_BUDGETS,
  GET_BUDGET_TOTAL,
  CREATE_BUDGET,
  DELETE_BUDGET,
} as { [key: string]: DocumentNode };
