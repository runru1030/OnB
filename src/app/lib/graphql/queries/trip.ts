import { gql } from "apollo-server-micro";
import { DocumentNode } from "graphql";

const CREATE_TRIP = gql`
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
        currencyId
      }
    }
  }
`;

const DELETE_TRIP = gql`
  mutation DeleteTrip($id: ID!) {
    deleteTrip(id: $id) {
      id
    }
  }
`;
const GET_TRIP = gql`
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
        currencyId
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
            type
            Currency {
              id
              amountUnit
            }
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
            type
            Currency {
              id
              amountUnit
            }
          }
        }
      }
    }
  }
`;
const GET_TRIPS = gql`
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
        currencyId
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
        currencyId
      }
    }
  }
`;

export default {
  GET_TRIP,
  GET_TRIPS,
  GET_PASSED_TRIPS,
  CREATE_TRIP,
  DELETE_TRIP,
} as { [key: string]: DocumentNode };
