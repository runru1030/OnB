import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Link from "next/link";
import { Suspense } from "react";
import BudgetAggregation from "./_components/BudgetAggregation";
import BudgetsContent from "./_components/BudgetsContent";
import CreateBudgetModal from "./_components/CreateBudgetModal";
import CreateExpenseModal from "./_components/CreateExpenseModal";
import CreateIncomeModal from "./_components/CreateIncomeModal";
import TripProvider from "./_components/TripProvider";

const Page = ({ params: { tid } }: { params: { tid: string } }) => {
  return (
    <TripProvider>
      <div className="main-content flex flex-col">
        <Link
          href={`/trip/${tid}/detail`}
          className="flex justify-between items-center"
        >
          내역 자세히 보기
          <ArrowForwardIosSharpIcon sx={{ fontSize: 16 }} />
        </Link>
        <div className="flex-1 flex flex-col gap-4">
          <Suspense
            fallback={Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-grey-0 w-[358px] h-[44px] rounded-md"
              ></div>
            ))}
          >
            <BudgetsContent tid={tid} />
          </Suspense>
          <CreateBudgetModal />
          <div className="flex gap-4">
            <CreateIncomeModal />
            <CreateExpenseModal />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 flex flex-col bg-grey-light-300 rounded-t-2xl w-full p-6 gap-3 shadow-normal">
          <Suspense fallback={<div className="h-[100px]"></div>}>
            <BudgetAggregation tid={tid} />
          </Suspense>
        </div>
      </div>
    </TripProvider>
  );
};

export default Page;
