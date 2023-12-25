import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_EXPENSES, GET_INCOMES } from "@app/lib/graphql/queries";
import { use } from "react";
import IncomeExpenseList from "../../_components/IncomeExpenseList";
const PageContent = ({ tid }: { tid: string }) => {
  const [{ data: incomesQuery }, { data: expensesQuery }] = use(
    Promise.all([
      getClient().query({ query: GET_INCOMES, variables: { tid } }),
      getClient().query({ query: GET_EXPENSES, variables: { tid } }),
    ])
  );
  const dataList = [
    ...(expensesQuery?.expenses || []),
    ...(incomesQuery?.incomes || []),
  ];

  return (
    <>
      {dataList.length !== 0 ? (
        <div className="main-content flex flex-col px-0 gap-2">
          <IncomeExpenseList dataList={dataList} />
        </div>
      ) : (
        <div className="main-content items-center justify-center text-grey-400 bg-grey-light-300">
          지출 및 충전 내역이 없습니다!
        </div>
      )}
    </>
  );
};

export default PageContent;
