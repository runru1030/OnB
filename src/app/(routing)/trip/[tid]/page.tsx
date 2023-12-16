import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_TRIP } from "@lib/graphql/queries";
import { use } from "react";
import PageContent from "./_components/PageContent";
import TripProvider from "./_components/TripProvider";

const Page = ({ params: { tid } }: { params: { tid: string } }) => {
  const { data } = use(
    getClient().query({ query: GET_TRIP, variables: { id: tid } })
  );

  return (
    <TripProvider trip={data?.trip}>
      <PageContent trip={data?.trip} />
    </TripProvider>
  );
};

export default Page;
