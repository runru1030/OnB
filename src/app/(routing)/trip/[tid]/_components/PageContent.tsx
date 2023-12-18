"use client";
import Link from "next/link";
import LOGO from "public/assets/logo_sm.svg";
import { TripQueryData } from "../_types";
import BudgetBox from "./BudgetBox";
import BudgetModal from "./BudgetModal";
import CreateBudgetModal from "./CreateBudgetModal";
import CreateExpenseModal from "./CreateExpenseModal";
import CreateIncomeModal from "./CreateIncomeModal";
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
        <div className="fixed bottom-0 left-0 flex flex-col bg-grey-light-300 rounded-t-2xl w-full p-6 gap-3 shadow-normal">
          <div className="flex justify-between items-center">
            <span>총 예산</span>
            <span className="font-medium">
              {trip.totalBudgetIncomesKRW.toLocaleString()} 원
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>총 지출</span>
            <span className="font-medium">
              {trip.totalBudgetExpenseKRW.toLocaleString()} 원
            </span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span>남은 예산</span>
            <span className="text-blue font-medium">
              {(
                trip.totalBudgetIncomesKRW - trip.totalBudgetExpenseKRW
              ).toLocaleString()}{" "}
              원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContent;
