import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Link from "next/link";
import { Suspense } from "react";
import BudgetAggregation from "./_components/BudgetAggregation";
import BudgetsContent from "./_components/BudgetsContent";
import TripProvider from "./_components/TripProvider";
import TripInfoModal from "./_components/TripInfoModal";
import Header from "@components/Header";

const Page = ({ params: { tid } }: { params: { tid: string } }) => {
  return (
    <div>
      <Header.WithLogo>
        <TripInfoModal />
      </Header.WithLogo>
      <TripProvider>
        <div className="main-content !p-0 flex flex-col">
          <div className="flex-1 flex flex-col p-4 gap-4">
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
          </div>
          <Suspense
            fallback={
              <div className="h-[100px]fixed bottom-0 left-0 bg-grey-light-300 rounded-t-2xl w-full p-6 shadow-normal"></div>
            }
          >
            <BudgetAggregation tid={tid} />
          </Suspense>
        </div>
      </TripProvider>
    </div>
  );
};

export default Page;
