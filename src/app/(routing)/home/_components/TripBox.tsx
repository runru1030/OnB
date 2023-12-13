import { TripQueryData } from "../_types";

const dateformatter = (date: Date) =>
  `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;

const TripBox = ({ title, startedAt, endedAt, Country }: TripQueryData) => {
  return (
    <div className="bg-grey-50 flex flex-col h-[150px] p-4 justify-between items-center rounded-xl boxShadow">
      <div className="flex flex-col gap-1 items-center">
        <div className=" text-lg font-medium">{title}</div>
        <div className="flex gap-1">
          <span>{dateformatter(new Date(startedAt))}</span>-
          <span>{dateformatter(new Date(endedAt))}</span>
        </div>
      </div>
      <div>{Country.name}</div>
    </div>
  );
};

export default TripBox;
