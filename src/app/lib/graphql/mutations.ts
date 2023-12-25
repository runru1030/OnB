import { gql } from "@apollo/client";

export const CREATE_TRIP = gql`
  mutation CreateTrip(
    $title: String
    $startedAt: Date
    $endedAt: Date
    $countryId: String
    $userId: ID
  ) {
    createTrip(
      title: $title
      startedAt: $startedAt
      endedAt: $endedAt
      countryId: $countryId
      userId: $userId
    ) {
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

export const CREATE_BUDGET = gql`
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

export const CREATE_INCOME = gql`
  mutation CreateIncome(
    $title: String
    $amount: Float
    $exchangeRate: Float
    $createdAt: Date
    $budgetId: ID
    $tripId: ID
  ) {
    createIncome(
      title: $title
      amount: $amount
      exchangeRate: $exchangeRate
      createdAt: $createdAt
      budgetId: $budgetId
      tripId: $tripId
    ) {
      id
      title
      amount
      exchangeRate
      createdAt
      budgetId
    }
  }
`;

export const CREATE_EXPENSE = gql`
  mutation CreateExpense(
    $title: String
    $amount: Float
    $category: String
    $createdAt: Date
    $budgetId: ID
    $tripId: ID
  ) {
    createExpense(
      title: $title
      amount: $amount
      category: $category
      createdAt: $createdAt
      budgetId: $budgetId
      tripId: $tripId
    ) {
      id
      title
      amount
      category
      createdAt
      budgetId
    }
  }
`;
export const CREATE_AUTH = gql`
  mutation CreateAuth($email: String!, $name: String) {
    createAuth(email: $email, name: $name) {
      id
      email
      name
    }
  }
`;
export const DELETE_BUDGET = gql`
  mutation DeleteBudget($id: ID!) {
    deleteBudget(id: $id) {
      id
    }
  }
`;
export const DELETE_TRIP = gql`
  mutation DeleteTrip($id: ID!) {
    deleteTrip(id: $id) {
      id
    }
  }
`;

export const DELETE_INCOME = gql`
  mutation DeleteIncome($id: ID!) {
    deleteIncome(id: $id) {
      id
    }
  }
`;

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id) {
      id
    }
  }
`;
