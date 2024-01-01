import { getClient } from "@app/_components/ApolloClientRSC";
import { expense, income } from "@app/lib/graphql/queries";
import { use } from "react";
import DetailContent from "./DetailContent";
const PageContent = ({ tid }: { tid: string }) => {
  const [{ data: incomesQuery }, { data: expensesQuery }] = use(
    Promise.all([
      getClient().query({ query: income.GET_INCOMES, variables: { tid } }),
      getClient().query({ query: expense.GET_EXPENSES, variables: { tid } }),
    ])
  );
  const dataList = [
    ...(expensesQuery?.expenses || []),
    ...(incomesQuery?.incomes || []),
  ];

  return (
    <>
      {dataList.length !== 0 ? (
        <DetailContent dataList={dataList} />
      ) : (
        <div className="main-content items-center justify-center text-grey-400 bg-grey-light-300">
          지출 및 충전 내역이 없습니다!
        </div>
      )}
    </>
  );
};

export default PageContent;
