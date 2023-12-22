import { Suspense } from "react";
import PageContent from "./_components/PageContent";
import LoadingDots from "@components/LoadingDots";

const Page = ({ params }: { params: { tid: string } }) => {
  return (
    <Suspense
      fallback={
        <div className="main-content items-center justify-center">
          <LoadingDots />
        </div>
      }
    >
      <PageContent {...params} />
    </Suspense>
  );
};

export default Page;
