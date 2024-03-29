import { gql } from "@apollo/client";

const GET_CURRENCIES = gql`
  query Currencies {
    currencies {
      id
      name
      amountUnit
      countries {
        id
        name
        name_en
        flag_img
        continent
      }
    }
  }
`;
export default { GET_CURRENCIES } 
