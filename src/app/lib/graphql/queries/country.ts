import { gql } from "@apollo/client";

const GET_COUNTRIES = gql`
  query Countries {
    countries {
      id
      name
      name_en
      flag_img
      continent
      currencyId
    }
  }
`;
export default { GET_COUNTRIES }
