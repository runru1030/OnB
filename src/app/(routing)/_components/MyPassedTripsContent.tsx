import { getClient } from "@app/_components/ApolloClientRSC";
import { trip } from "@app/lib/graphql/queries";
import { Session, getServerSession } from "next-auth";
import { use } from "react";
import { MyTripQueryData } from "../_types";
import TripBox from "./TripBox";
import { authOptions } from "@app/utils/next-auth/authOptions";
const MyPassedTripsContent = () => {
  const session = use(getServerSession(authOptions)) as Session;
  const { data } = use(
    getClient().query({
      query: trip.GET_PASSED_TRIPS,
      variables: { userId: session?.user.id || "" },
    })
  );

  return (
    <>
      {data?.passedTrips.map((trip: MyTripQueryData) => (
        <TripBox key={trip.id} {...{ ...trip }} />
      ))}
      {data?.passedTrips.length === 0 && (
        <div className="bg-grey-light-300 border border-grey-light-400 flex flex-col h-[160px] justify-center items-center rounded-2xl text-grey-300 gap-2">
          <div>아직 지난 여행이 없군요!</div>
        </div>
      )}
    </>
  );
};

export default MyPassedTripsContent;
