"use client";
import LOGO from "public/assets/logo_sm.svg";
import { Trip } from "../_types";
import BudgetBox from "./BudgetBox";
import BudgetModal from "./BudgetModal";
import CreateBudgetModal from "./CreateBudgetModal";
const PageContent = ({ trip }: { trip: Trip }) => {
  return (
    <div>
      <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4 justify-between">
        <LOGO />
        <h1 className="font-medium">{trip.title}</h1>
      </header>
      <div className="main-content">
        {trip?.budgets.map((budget) => (
          <BudgetModal.Trigger
            key={budget.id}
            budget={budget}
            className="!px-0"
          >
            <BudgetBox budget={budget} />
          </BudgetModal.Trigger>
        ))}
        <CreateBudgetModal />
        <BudgetModal />
      </div>
    </div>
  );
};

export default PageContent;
