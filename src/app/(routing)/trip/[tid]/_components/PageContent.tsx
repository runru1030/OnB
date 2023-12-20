"use client";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { useAtomValue } from "jotai";
import Link from "next/link";
import BudgetBox from "./BudgetBox";
import BudgetModal from "./BudgetModal";
import CreateBudgetModal from "./CreateBudgetModal";
import CreateExpenseModal from "./CreateExpenseModal";
import CreateIncomeModal from "./CreateIncomeModal";
import { tripAtom, tripStore } from "./TripProvider";
const PageContent = ({ params: { tid } }: { params: { tid: string } }) => {
  const trip = useAtomValue(tripAtom, { store: tripStore });
  return (
    <div className="main-content flex flex-col">
      <Link
        href={`/trip/${tid}/detail`}
        className="flex justify-between items-center"
      >
        내역 자세히 보기
        <ArrowForwardIosSharpIcon sx={{ fontSize: 16 }} />
      </Link>
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
            {Math.ceil(trip.totalBudgetIncomesKRW).toLocaleString()} 원
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">총 지출</span>
          <span className="font-medium">
            {Math.ceil(trip.totalBudgetExpenseKRW).toLocaleString()} 원
          </span>
        </div>
        <div className="flex justify-between items-center text-lg">
          <span>남은 예산</span>
          <span className="text-blue font-medium">
            {Math.ceil(
              trip.totalBudgetIncomesKRW - trip.totalBudgetExpenseKRW
            ).toLocaleString()}{" "}
            원
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageContent;
