"use client";
import { useAtomValue } from "jotai";
import LOGO from "public/assets/logo_sm.svg";
import { tripAtom, tripStore } from "./TripProvider";
import CreateBudgetModal from "./_components/CreateBudgetModal";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
const PageContent = () => {
  const { budgets, title } = useAtomValue(tripAtom, { store: tripStore });

  return (
    <div>
      <header className="bg-white h-[52px] flex items-center sticky top-0 left-0 px-4 justify-between">
        <LOGO />
        <h1 className="font-medium">{title}</h1>
      </header>
      <CreateBudgetModal />
      <div className="main-content">
        {budgets.map((budget) => (
          <div className="flex justify-between items-center" key={budget.id}>
            <h2 className="font-medium text-lg">{budget.title}</h2>
            <div className="flex items-center gap-2">
              <div className="text-lg flex gap-0.5">
                <span>{budget.totalIncomes - budget.totalExpenses}</span>
                <span className="text-grey-400">/</span>
                <span className="text-grey-400">
                  {budget.totalIncomes ?? 0}
                </span>
                <span className="w-12 pl-2">{budget.Currency.id}</span>
              </div>
              <span className="text-sm text-grey-300">
                {
                  {
                    CASH: <PaymentsTwoToneIcon />,
                    CARD: <PaymentTwoToneIcon />,
                  }[budget.type]
                }
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageContent;
