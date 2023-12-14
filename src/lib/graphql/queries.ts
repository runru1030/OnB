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
      Country {
        id
        name
        name_en
        flag_img
      }
      budgets {
        id
        type
        amount
        Currency {
          id
          name
        }
        expenses {
          id
          category
          amount
          usedAt
          budgetId
        }
      }
      expenses {
        id
        category
        amount
        usedAt
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
