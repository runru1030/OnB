import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_TRIPS } from "@lib/graphql/queries";
import { Suspense, use } from "react";
import MyTripProvider from "./_components/MyTripProvider";
import PageContent from "./_components/PageContent";

const Page = () => {
  const { data } = use(getClient().query({ query: GET_TRIPS }));

  return (
    <Suspense fallback={<div>럳;ㅇㅇ;ㅇ</div>}>
      <MyTripProvider myTrips={data?.trips}>
        <PageContent />
      </MyTripProvider>
    </Suspense>
  );
};

export default Page;
