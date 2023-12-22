import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_BUDGET_TOTAL } from "@app/lib/graphql/queries";
import { use } from "react";

const BudgetAggregation = ({ tid }: { tid: string }) => {
  const { data } = use(
    getClient().query({ query: GET_BUDGET_TOTAL, variables: { tid } })
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <span>총 예산</span>
        <span className="font-medium">
          {Math.ceil(data?.budgetTotal?.totalBudgetIncomesKRW).toLocaleString()}{" "}
          원
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2">총 지출</span>
        <span className="font-medium">
          {Math.ceil(data?.budgetTotal?.totalBudgetExpenseKRW).toLocaleString()}{" "}
          원
        </span>
      </div>
      <div className="flex justify-between items-center text-lg">
        <span>남은 예산</span>
        <span className="text-blue font-medium">
          {Math.ceil(
            data?.budgetTotal?.totalBudgetIncomesKRW -
              data?.budgetTotal?.totalBudgetExpenseKRW
          ).toLocaleString()}{" "}
          원
        </span>
      </div>
    </>
  );
};

export default BudgetAggregation;
