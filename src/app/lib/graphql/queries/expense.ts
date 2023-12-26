import { gql } from "apollo-server-micro";
import { DocumentNode } from "graphql";

const CREATE_EXPENSE = gql`
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
const UPDATE_EXPENSE = gql`
  mutation UpdateExpense(
    $id: ID!
    $title: String
    $amount: Float
    $category: String
    $createdAt: Date
    $budgetId: ID
    $tripId: ID
  ) {
    updateExpense(
      id: $id
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
`;
export default {
  GET_EXPENSES,
  CREATE_EXPENSE,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
} as { [key: string]: DocumentNode };