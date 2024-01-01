import { getClient } from "@app/_components/ApolloClientRSC";
import { budget } from "@app/lib/graphql/queries";
import Link from "next/link";
import { use } from "react";
import { BudgetQueryData } from "../_types";
import BudgetBox from "./BudgetBox";
import CreateBudgetModal from "./CreateBudgetModal";

const BudgetsContent = ({ tid }: { tid: string }) => {
  const { data } = use(
    getClient().query({ query: budget.GET_BUDGETS, variables: { tid } })
  );

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-auto">
      {(data?.budgets as BudgetQueryData[]).map((budget) => (
        <Link href={`/trip/${tid}/${budget.id}`} key={budget.id}>
          <BudgetBox budget={budget} />
        </Link>
      ))}
      <CreateBudgetModal />
    </div>
  );
};

export default BudgetsContent;
