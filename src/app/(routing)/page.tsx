import Header from "@components/Header";
import LoadingDots from "@components/LoadingDots";
import { Suspense } from "react";
import MyInfoModal from "./_components/MyInfoModal";
import MyPassedTripsContent from "./_components/MyPassedTripsContent";
import MyTripsContent from "./_components/MyTripsContent";

export default function Page() {
  return (
    <div className="bg-grey-light-300">
      <Header.WithLogo>
        <MyInfoModal />
      </Header.WithLogo>
      <div className="main-content">
        <div className="flex flex-col bg-white rounded-xl p-3 border border-grey-light-400 gap-3">
          <h2 className="text-lg font-medium">내 여행</h2>
          <Suspense fallback={<SkeletonBox />}>
            <MyTripsContent />
          </Suspense>
        </div>
        <div className="flex flex-col bg-white rounded-xl p-3 border border-grey-light-400 gap-3">
          <h2 className="text-lg font-medium text-grey-300">지난 여행</h2>
          <Suspense fallback={<SkeletonBox />}>
            <MyPassedTripsContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const SkeletonBox = () => {
  return (
    <div className="bg-grey-light-300 border border-grey-light-400 flex flex-col h-[160px] justify-center items-center rounded-2xl text-grey-300 gap-2">
      <LoadingDots />
    </div>
  );
};
