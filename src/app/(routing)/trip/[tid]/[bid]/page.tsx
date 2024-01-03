import { getClient } from "@app/_components/ApolloClientRSC";
import { budget } from "@app/lib/graphql/queries";
import Header from "@components/Header";
import { use } from "react";
import IncomeExpenseList from "../_components/IncomeExpenseList";
import BudgetInfoContent from "./_components/BudgetInfoContent";
import EditBudgetModalWithTrigger from "./_components/EditBudgetModalWithTrigger";

const Page = ({ params: { bid } }: { params: { bid: string } }) => {
  const { data: budgetQuery } = use(
    getClient().query({ query: budget.GET_BUDGET, variables: { id: bid } })
  );
  const budgetData = budgetQuery?.budget;
  return (
    <div>
      <Header>
        <EditBudgetModalWithTrigger budget={budgetData} />
        <span className="text-lg font-medium ">{budgetData.title}</span>
      </Header>
      <div className="flex flex-col h-[calc(100%-60px)] overflow-auto">
        <BudgetInfoContent budget={budgetData} />
        <div className="flex flex-col gap-2">
          {(budgetData?.incomes || budgetData?.expenses) && (
            <IncomeExpenseList
              dataList={[...budgetData.incomes, ...budgetData.expenses]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
