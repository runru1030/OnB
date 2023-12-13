import Image from "next/image";
import { TripQueryData } from "../_types";

const dateformatter = (date: Date) =>
  `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;

// const Flag = (countryId: string) => <Image src={}/>;
const TripBox = ({ title, startedAt, endedAt, Country }: TripQueryData) => {
  return (
    <div className="bg-grey-light-100 border border-grey-light-600 flex flex-col h-[200px] p-4 justify-between items-center rounded-2xl shadow-normal">
      <div className=" text-lg font-medium">{title}</div>
      <div className="flex flex-col gap-2 items-center">
        <Image src={Country.flag_img ?? ""} width={60} height={10} alt="국기" />
        <span className="text-sm text-grey-500">{Country.name}</span>
      </div>
      <div className="flex gap-1 text-grey-400 tracking-wide font-light">
        <span>{dateformatter(new Date(startedAt))}</span>-
        <span>{dateformatter(new Date(endedAt))}</span>
      </div>
    </div>
  );
};

export default TripBox;
