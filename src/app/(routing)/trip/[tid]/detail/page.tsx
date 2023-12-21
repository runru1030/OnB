import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_EXPENSES, GET_INCOMES } from "@app/lib/graphql/queries";
import { use } from "react";
import PageContent from "./_components/PageContent";
import TripDetailProvider from "./_components/TripDetailProvider";

const Page = ({ params: { tid } }: { params: { tid: string } }) => {
  const { data: expensesQuery } = use(
    getClient().query({ query: GET_EXPENSES, variables: { tripId: tid } })
  );
  const { data: incomesQuery } = use(
    getClient().query({ query: GET_INCOMES, variables: { tripId: tid } })
  );

  return (
    <TripDetailProvider
      expenses={expensesQuery?.expenses}
      incomes={incomesQuery?.incomes}
    >
      <PageContent />
    </TripDetailProvider>
  );
};

export default Page;
