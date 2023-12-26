import { getClient } from "@app/_components/ApolloClientRSC";
import { budget } from "@app/lib/graphql/queries";
import { use } from "react";
import { BudgetQueryData } from "../_types";
import BudgetBox from "./BudgetBox";
import BudgetModal from "./BudgetModal";
import CreateBudgetModal from "./CreateBudgetModal";

const BudgetsContent = ({ tid }: { tid: string }) => {
  const { data } = use(
    getClient().query({ query: budget.GET_BUDGETS, variables: { tid } })
  );

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-auto">
      {(data?.budgets as BudgetQueryData[]).map((budget) => (
        <BudgetModal.Trigger key={budget?.id} budget={budget} className="!px-0">
          <BudgetBox budget={budget} />
        </BudgetModal.Trigger>
      ))}
      <BudgetModal />
      <CreateBudgetModal />
    </div>
  );
};

export default BudgetsContent;
