"use client";
import { useQuery } from "@apollo/client";
import { GET_TRIPS } from "@lib/graphql/queries";
import TripBox from "./_components/TripBox";
import { TripQueryData } from "./_types";

const Page = () => {
  const { data, loading, error } = useQuery(GET_TRIPS, {
    variables: { userId: 1 },
  });

  return (
    <div>
      <header className="h-[52px]"></header>
      <div className="w-full flex flex-col gap-4 px-4">
        {data?.trips?.map((trip: TripQueryData) => (
          <TripBox key={trip.id} {...{ ...trip }} />
        ))}

        <button className="fixed bottom-10 left-1/2 -translate-x-1/2">
          여행 추가
        </button>
      </div>
    </div>
  );
};

export default Page;
