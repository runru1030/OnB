import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_EXPENSES, GET_TRIP } from "@lib/graphql/queries";
import { use } from "react";
import PageContent from "./_components/PageContent";
import TripExpenseProvider from "./_components/TripExpenseProvider";

const Page = ({ params: { tid } }: { params: { tid: string } }) => {
  const { data } = use(
    getClient().query({ query: GET_EXPENSES, variables: { tripId: tid } })
  );

  return (
    <TripExpenseProvider expenses={data?.expenses}>
      <PageContent />
    </TripExpenseProvider>
  );
};

export default Page;
