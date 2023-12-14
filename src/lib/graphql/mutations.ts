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
      totalIncomes
      totalExpenses
      Currency {
        id
        name
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
export const DELETE_BUDGET = gql`
  mutation DeleteBudget($id: ID!) {
    deleteBudget(id: $id) {
      id
    }
  }
`;
