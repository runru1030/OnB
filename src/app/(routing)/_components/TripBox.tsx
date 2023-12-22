import Image from "next/image";
import Link from "next/link";
import { MyTripQueryData } from "../_types";
import { dateformatter } from "@app/utils";

const TripBox = ({ id, title, startedAt, endedAt, Country }: MyTripQueryData) => {
  return (
    <Link
      href={`/trip/${id}`}
      className="bg-grey-light-300 border border-grey-light-400 flex flex-col h-[160px] p-4 justify-between items-center rounded-2xl"
    >
      <div className="font-medium">{title}</div>
      <div className="flex flex-col gap-2 items-center">
        <Image src={Country.flag_img ?? ""} width={50} height={10} alt="국기" />
        <span className="text-xs text-grey-500">{Country.name}</span>
      </div>
      <div className="flex gap-1 text-grey-400 tracking-wide font-light text-sm">
        <span>{dateformatter(new Date(startedAt))}</span>-
        <span>{dateformatter(new Date(endedAt))}</span>
      </div>
    </Link>
  );
};

export default TripBox;
