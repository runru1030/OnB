"use client";
import { useMutation } from "@apollo/client";
import Button from "@components/Button";
import { DELETE_TRIP } from "@lib/graphql/mutations";
import { useRouter } from "next/navigation";
import LOGO from "public/assets/logo_sm.svg";
import { TripQueryData } from "../_types";
import BudgetBox from "./BudgetBox";
import BudgetModal from "./BudgetModal";
import CreateBudgetModal from "./CreateBudgetModal";
import CreateIncomeModal from "./CreateIncomeModal";
const PageContent = ({ trip }: { trip: TripQueryData }) => {
  const router = useRouter();
  const [deleteBudget] = useMutation(DELETE_TRIP, {
    variables: { id: trip?.id },
    onCompleted: () => {
      router.push("/home");
      router.refresh();
    },
  });

  return (
    <div>
      <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4 justify-between">
        <LOGO />
        <h1 className="font-medium">{trip.title}</h1>
      </header>
      <div className="main-content flex flex-col">
        <div className="flex-1 flex flex-col gap-4">
          <CreateBudgetModal />
          {trip?.budgets.map((budget) => (
            <BudgetModal.Trigger
              key={budget.id}
              budget={budget}
              className="!px-0"
            >
              <BudgetBox budget={budget} />
            </BudgetModal.Trigger>
          ))}
          <BudgetModal />
          {trip.budgets.length > 0 && <CreateIncomeModal />}
        </div>
        <Button
          className="btn-red-border text-sm"
          onClick={() => {
            deleteBudget({ variables: { id: trip?.id } });
          }}
        >
          여행 삭제하기
        </Button>
      </div>
    </div>
  );
};

export default PageContent;
