import { GET } from "@app/api/auth/[...nextauth]/route";
import { Session, getServerSession } from "next-auth";
import { use } from "react";
import PageContent from "./PageContent";
import { redirect } from "next/navigation";

const Page = () => {
  const session = use(getServerSession(GET));
  if ((session as Session)?.user?.email) redirect("/home");

  return (
    <div>
      <PageContent />
    </div>
  );
};

export default Page;
