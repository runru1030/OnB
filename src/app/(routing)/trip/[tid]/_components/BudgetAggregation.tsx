import { getClient } from "@app/_components/ApolloClientRSC";
import { budget } from "@app/lib/graphql/queries";
import { use } from "react";
import CreateExpenseModal from "./CreateExpenseModal";
import CreateIncomeModal from "./CreateIncomeModal";

const BudgetAggregation = ({ tid }: { tid: string }) => {
  const { data } = use(
    getClient().query({ query: budget.GET_BUDGET_TOTAL, variables: { tid } })
  );
  const { totalBudgetIncomesKRW, totalBudgetExpenseKRW, totalBudgetCount } =
    data?.budgetTotal ?? 0;

  return (
    <div className="sticky bottom-0 left-0 flex flex-col bg-white rounded-t-3xl w-full p-8 gap-3 shadow-lg border border-grey-50">
      {totalBudgetCount !== 0 && (
        <div className="flex gap-4 mb-2">
          <CreateIncomeModal />
          <CreateExpenseModal />
        </div>
      )}
      <div className="flex justify-between items-center">
        <span>총 예산</span>
        <span className="font-medium">
          {Math.ceil(totalBudgetIncomesKRW).toLocaleString()} 원
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2">총 지출</span>
        <span className="font-medium">
          {Math.ceil(totalBudgetExpenseKRW).toLocaleString()} 원
        </span>
      </div>
      <div className="flex justify-between items-center text-lg">
        <span>남은 예산</span>
        <span className="text-blue font-medium">
          {Math.ceil(
            totalBudgetIncomesKRW - totalBudgetExpenseKRW
          ).toLocaleString()}{" "}
          원
        </span>
      </div>
    </div>
  );
};

export default BudgetAggregation;
