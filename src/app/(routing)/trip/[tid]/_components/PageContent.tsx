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
import CreateExpenseModal from "./CreateExpenseModal";
import Link from "next/link";
import TripInfoModal from "./TripInfoModal";
const PageContent = ({ trip }: { trip: TripQueryData }) => {
  return (
    <div>
      <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4 justify-between">
        <Link href={"/home"}>
          <LOGO />
        </Link>
        <TripInfoModal />
      </header>
      <div className="main-content flex flex-col">
        <div className="flex-1 flex flex-col gap-4">
          {trip?.budgets.map((budget) => (
            <BudgetModal.Trigger
            key={budget.id}
            budgetId={budget.id}
            className="!px-0"
            >
              <BudgetBox budget={budget} />
            </BudgetModal.Trigger>
          ))}
          <CreateBudgetModal />
          <BudgetModal />
          <div className="flex gap-4">
            {trip.budgets.length > 0 && <CreateIncomeModal />}
            {trip.budgets.length > 0 && <CreateExpenseModal />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContent;
