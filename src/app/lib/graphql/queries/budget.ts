import { gql } from "@apollo/client";

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
            name
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
            name
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
            name
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
            name
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

const UPDATE_BUDGET = gql`
  mutation UpdateBudget($id: ID!, $title: String, $type: String) {
    updateBudget(id: $id, title: $title, type: $type) {
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

export default {
  GET_BUDGET,
  GET_BUDGETS,
  GET_BUDGET_TOTAL,
  CREATE_BUDGET,
  DELETE_BUDGET,
  UPDATE_BUDGET,
} 
