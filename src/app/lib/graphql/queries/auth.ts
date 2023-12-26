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
const GET_USER = gql`
  query User($email: String!) {
    user(email: $email) {
      id
      email
      name
    }
  }
`;

export default { GET_USER, CREATE_AUTH };
