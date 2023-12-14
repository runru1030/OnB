export const typeDefs = `#graphql 
  scalar Date
  type Country{
    id:ID!
    name:String
    name_en:String
    flag_img:String
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
    countries:[Country]
  }	
  type Mutation {
    createTrip (
    title:String,
    startedAt:Date,
    endedAt:Date,
    countryId:String, 
    userId:ID) : Trip
  }

`;
