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
      countryId
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
