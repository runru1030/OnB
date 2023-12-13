export const typeDefs = `#graphql 
  scalar Date
  type Country{
    id:ID!
    name:String
  }
  type Trip{
    id:ID!
    title:String
    startedAt:Date
    endedAt:Date
    countryId:String
    Country:Country
  }
  type Query {
	  trip(id: ID!): Trip 
    trips:[Trip]
  }
`;
