import { gql } from "@apollo/client";

const CREATE_INCOME = gql`
  mutation CreateIncome(
    $title: String
    $amount: Float
    $exchangeRate: Float
    $date: Date
    $budgetId: ID
    $tripId: ID
  ) {
    createIncome(
      title: $title
      amount: $amount
      exchangeRate: $exchangeRate
      date: $date
      budgetId: $budgetId
      tripId: $tripId
    ) {
      id
      title
      amount
      exchangeRate
      date
      createdAt
      budgetId
    }
  }
`;
const CREATE_INCOMES = gql`
  mutation CreateIncomes($incomes: [IncomeInput]) {
    createIncomes(incomes: $incomes) {
      __typename
    }
  }
`;

const UPDATE_INCOME = gql`
  mutation UpdateIncome(
    $id: ID!
    $title: String
    $amount: Float
    $exchangeRate: Float
    $date: Date
    $budgetId: ID
    $tripId: ID
  ) {
    updateIncome(
      id: $id
      title: $title
      amount: $amount
      exchangeRate: $exchangeRate
      date: $date
      budgetId: $budgetId
      tripId: $tripId
    ) {
      id
      title
      amount
      exchangeRate
      date
      createdAt
      budgetId
    }
  }
`;
const DELETE_INCOME = gql`
  mutation DeleteIncome($id: ID!, $budgetId: ID!) {
    deleteIncome(id: $id, budgetId: $budgetId) {
      id
    }
  }
`;
const GET_INCOMES = gql`
  query Incomes($tid: ID!) {
    incomes(tid: $tid) {
      id
      title
      amount
      exchangeRate
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
  GET_INCOMES,
  CREATE_INCOME,
  UPDATE_INCOME,
  DELETE_INCOME,
  CREATE_INCOMES,
};
