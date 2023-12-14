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
