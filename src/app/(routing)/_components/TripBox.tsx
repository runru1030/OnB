import { dateformatter } from "@app/utils";
import CountryFlag from "@components/CountryFlag";
import Link from "next/link";
import { MyTripQueryData } from "../_types";

const TripBox = ({
  id,
  title,
  startedAt,
  endedAt,
  Country,
}: MyTripQueryData) => {
  return (
    <Link
      href={`/trip/${id}`}
      className="active:shadow-normal border border-grey-light-400 flex flex-col h-[170px] p-4 justify-between items-center rounded-2xl"
    >
      <div className="font-medium">{title}</div>
      <div className="flex flex-col gap-2 items-center">
        <CountryFlag country={Country} />
        <span className="text-xs text-grey-200">{Country.name}</span>
      </div>
      <div className="flex gap-1 text-grey-200 tracking-wide font-light text-sm">
        <span>{dateformatter(new Date(startedAt))}</span>-
        <span>{dateformatter(new Date(endedAt))}</span>
      </div>
    </Link>
  );
};

export default TripBox;
