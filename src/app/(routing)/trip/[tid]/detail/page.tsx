import { Suspense } from "react";
import PageContent from "./_components/PageContent";
import LoadingDots from "@components/LoadingDots";
import Header from "@components/Header";

const Page = ({ params }: { params: { tid: string } }) => {
  return (
    <div>
      <Header.WithLogo />
      <Suspense
        fallback={
          <div className="main-content items-center justify-center">
            <LoadingDots />
          </div>
        }
      >
        <PageContent {...params} />
      </Suspense>
    </div>
  );
};

export default Page;
