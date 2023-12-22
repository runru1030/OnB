import { getClient } from "@app/_components/ApolloClientRSC";
import { GET_BUDGETS } from "@app/lib/graphql/queries";
import { use } from "react";
import { BudgetQueryData } from "../_types";
import BudgetBox from "./BudgetBox";
import BudgetModal from "./BudgetModal";

const BudgetsContent = ({ tid }: { tid: string }) => {
  const { data } = use(
    getClient().query({ query: GET_BUDGETS, variables: { tid } })
  );

  return (
    <>
      {(data?.budgets as BudgetQueryData[]).map((budget) => (
        <BudgetModal.Trigger key={budget?.id} budget={budget} className="!px-0">
          <BudgetBox budget={budget} />
        </BudgetModal.Trigger>
      ))}
      <BudgetModal />
    </>
  );
};

export default BudgetsContent;
