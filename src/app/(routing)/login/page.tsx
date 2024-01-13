import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { use } from "react";
import PageContent from "./PageContent";

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
