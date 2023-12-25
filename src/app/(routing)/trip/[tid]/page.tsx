import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Link from "next/link";
import { Suspense } from "react";
import BudgetAggregation from "./_components/BudgetAggregation";
import BudgetsContent from "./_components/BudgetsContent";
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
