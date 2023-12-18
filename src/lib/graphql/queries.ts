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

export const GET_TRIP = gql`
  query Trip($id: ID!) {
    trip(id: $id) {
      id
      title
      startedAt
      endedAt
      totalBudgetIncomesKRW
      totalBudgetExpenseKRW
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
        totalIncomes
        totalExpenses
        totalIncomesKRW
        totalExpensesKRW
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
        }
        incomes {
          id
          amount
          exchangeRate
          createdAt
        }
      }
      expenses {
        id
        category
        amount
        budgetId
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
