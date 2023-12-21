import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_TRIPS } from "@app/lib/graphql/queries";
import { use } from "react";
import MyTripProvider from "./_components/MyTripProvider";
import PageContent from "./_components/PageContent";

const Page = () => {
  const { data } = use(getClient().query({ query: GET_TRIPS }));

  return (
    <MyTripProvider myTrips={data?.trips}>
      <PageContent />
    </MyTripProvider>
  );
};

export default Page;
