import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_EXPENSES, GET_INCOMES } from "@app/lib/graphql/queries";
import { use } from "react";
import IncomeExpenseList from "../../_components/IncomeExpenseList";
const PageContent = ({ tid }: { tid: string }) => {
  const { data: expensesQuery } = use(
    getClient().query({ query: GET_EXPENSES, variables: { tripId: tid } })
  );
  const { data: incomesQuery } = use(
    getClient().query({ query: GET_INCOMES, variables: { tripId: tid } })
  );

  return (
    <div className="main-content flex flex-col px-0 gap-2">
      <IncomeExpenseList
        dataList={[
          ...(expensesQuery?.expenses || []),
          ...(incomesQuery?.incomes || []),
        ]}
      />
    </div>
  );
};

export default PageContent;
