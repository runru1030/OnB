import { gql } from "apollo-server-micro";

const CREATE_AUTH = gql`
  mutation CreateAuth($email: String!, $name: String) {
    createAuth(email: $email, name: $name) {
      id
      email
      name
    }
  }
`;
export default { CREATE_AUTH };
