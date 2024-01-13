import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { use } from "react";
import PageContent from "./PageContent";
import { authOptions } from "@app/utils/next-auth/authOptions";

const Page = () => {
  const session = use(getServerSession(authOptions));
  if ((session as Session)?.user?.email) redirect("/");

  return (
    <div>
      <PageContent />
    </div>
  );
};

export default Page;
