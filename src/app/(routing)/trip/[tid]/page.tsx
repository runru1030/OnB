import PageContent from "./_components/PageContent";

const Page = ({ params }: { params: { tid: string } }) => {
  return <PageContent {...{ params }} />;
};

export default Page;
