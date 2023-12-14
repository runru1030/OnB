import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_TRIP, GET_TRIPS } from "@lib/graphql/queries";
import { use } from "react";
import PageContent from "./PageContent";
import TripProvider from "./TripProvider";

const Page = ({ params: { tid } }: { params: { tid: string } }) => {
  const { data } = use(
    getClient().query({ query: GET_TRIP, variables: { id: tid } })
  );
  return (
    <TripProvider trip={data?.trip}>
      <PageContent />
    </TripProvider>
  );
};

export default Page;
