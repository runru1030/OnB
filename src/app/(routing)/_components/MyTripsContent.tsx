import { getClient } from "@app/_components/ApolloClientRSC";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { trip } from "@app/lib/graphql/queries";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import { Session, getServerSession } from "next-auth";
import { use } from "react";
import { MyTripQueryData } from "../_types";
import CreateTripModal from "./CreateTripModal";
import TripBox from "./TripBox";
const MyTripsContent = () => {
  const session = use(getServerSession(authOptions)) as Session;
  const { data } = use(
    getClient().query({
      query: trip.GET_TRIPS,
      variables: { userId: session?.user.id || "" },
    })
  );

  return (
    <>
      <CreateTripModal />
      {data.trips.map((trip: MyTripQueryData) => (
        <TripBox key={trip.id} {...{ ...trip }} />
      ))}
      {data.trips.length === 0 && (
        <div className="bg-grey-light-300 border border-grey-light-400 flex flex-col h-[160px] justify-center items-center rounded-2xl text-grey-300 gap-2">
          <div>여행을 만들어 보세요!</div>
          <AddCircleTwoToneIcon />
        </div>
      )}
    </>
  );
};

export default MyTripsContent;
