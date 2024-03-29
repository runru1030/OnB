import { gql } from "@apollo/client";

const CREATE_EXPENSE = gql`
  mutation CreateExpense(
    $title: String
    $amount: Float
    $category: String
    $date: Date
    $budgetId: ID
    $tripId: ID
  ) {
    createExpense(
      title: $title
      amount: $amount
      category: $category
      date: $date
      budgetId: $budgetId
      tripId: $tripId
    ) {
      id
      title
      amount
      category
      date
      createdAt
      budgetId
    }
  }
`;
const CREATE_EXPENSES = gql`
  mutation CreateExpenses($expenses: [ExpenseInput]) {
    createExpenses(expenses: $expenses) {
      __typename
    }
  }
`;
const UPDATE_EXPENSE = gql`
  mutation UpdateExpense(
    $id: ID!
    $title: String
    $amount: Float
    $category: String
    $date: Date
    $budgetId: ID
    $tripId: ID
  ) {
    updateExpense(
      id: $id
      title: $title
      amount: $amount
      category: $category
      date: $date
      budgetId: $budgetId
      tripId: $tripId
    ) {
      id
      title
      amount
      category
      date
      createdAt
      budgetId
    }
  }
`;

const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id) {
      id
    }
  }
`;
const GET_EXPENSES = gql`
  query Expenses($tid: ID!) {
    expenses(tid: $tid) {
      id
      title
      category
      amount
      date
      createdAt
      budgetId
      Budget {
        title
        type
        exRateAVG
        Currency {
          id
          amountUnit
          name
        }
      }
    }
  }
`;
export default {
  GET_EXPENSES,
  CREATE_EXPENSE,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
  CREATE_EXPENSES,
};
