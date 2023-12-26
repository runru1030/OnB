import { gql } from "apollo-server-micro";

const CREATE_INCOME = gql`
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

const UPDATE_INCOME = gql`
  mutation UpdateIncome(
    $id: ID!
    $title: String
    $amount: Float
    $exchangeRate: Float
    $createdAt: Date
    $budgetId: ID
    $tripId: ID
  ) {
    updateIncome(
      id: $id
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
const DELETE_INCOME = gql`
  mutation DeleteIncome($id: ID!) {
    deleteIncome(id: $id) {
      id
    }
  }
`;
export default { CREATE_INCOME, UPDATE_INCOME, DELETE_INCOME };
