import { gql } from "@apollo/client";

export const GET_TRIPS = gql`
  query Trips {
    trips {
      id
      title
      startedAt
      endedAt
      countryId
      Country {
        id
        name
        name_en
        flag_img
      }
    }
  }
`;

export const GET_PASSED_TRIPS = gql`
  query PassedTrips {
    passedTrips {
      id
      title
      startedAt
      endedAt
      countryId
      Country {
        id
        name
        name_en
        flag_img
      }
    }
  }
`;
export const GET_TRIP = gql`
  query Trip($id: ID!) {
    trip(id: $id) {
      id
      title
      startedAt
      endedAt
      Country {
        id
        name
        name_en
        flag_img
      }
      budgets {
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
          category
          amount
          createdAt
          budgetId
          Budget {
            title
            currencyId
          }
        }
        incomes {
          id
          amount
          exchangeRate
          createdAt
          budgetId
          Budget {
            title
            currencyId
          }
        }
      }
    }
  }
`;
export const GET_COUNTRIES = gql`
  query Countries {
    countries {
      id
      name
      name_en
      flag_img
    }
  }
`;

export const GET_CURRENCIES = gql`
  query Currencies {
    currencies {
      id
      name
      countryId
      amountUnit
    }
  }
`;

export const GET_EXPENSES = gql`
  query Expenses($tid: ID!) {
    expenses(tid: $tid) {
      id
      title
      category
      amount
      createdAt
      budgetId
      Budget {
        title
        currencyId
      }
    }
  }
`;

export const GET_INCOMES = gql`
  query Incomes($tid: ID!) {
    incomes(tid: $tid) {
      id
      title
      amount
      exchangeRate
      createdAt
      budgetId
      Budget {
        title
        currencyId
      }
    }
  }
`;
export const GET_USER = gql`
  query User($email: String!) {
    user(email: $email) {
      id
      email
      name
    }
  }
`;

export const GET_BUDGET = gql`
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
          currencyId
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
          currencyId
        }
      }
    }
  }
`;

export const GET_BUDGETS = gql`
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
          currencyId
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
          currencyId
        }
      }
    }
  }
`;

export const GET_BUDGET_TOTAL = gql`
  query BudgetTotal($tid: ID!) {
    budgetTotal(tid: $tid) {
      totalBudgetIncomesKRW
      totalBudgetExpenseKRW
      totalBudgetCount
    }
  }
`;
