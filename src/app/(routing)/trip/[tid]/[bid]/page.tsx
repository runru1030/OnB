import { getClient } from "@app/_components/ApolloClientRSC";
import { budget } from "@app/lib/graphql/queries";
import Header from "@components/Header";
import { use } from "react";
import BudgetInfoContent from "./_components/BudgetInfoContent";
import DetailContent from "./_components/DetailContent";
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
      <div className="main-content !p-0">
        <BudgetInfoContent budget={budgetData} />
        <DetailContent
          dataList={[...budgetData.incomes, ...budgetData.expenses]}
        />
      </div>
    </div>
  );
};

export default Page;
