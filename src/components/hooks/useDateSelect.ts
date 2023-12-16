import { useState } from "react";
import { Range } from "react-date-range";
interface SelectionRange {
  [key: string]: Range;
}
interface useDateSelectProps {
  defaultStartDate?: Date;
  defaultEndDate?: Date;
}
const useDateSelect = ({
  defaultStartDate = new Date(),
  defaultEndDate = new Date(),
}: useDateSelectProps) => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    key: "selection",
  });
  const handleSelectDate = (ranges: SelectionRange) => {
    setSelectionRange({
      startDate: ranges?.["selection"].startDate ?? new Date(),
      endDate: ranges?.["selection"].endDate ?? new Date(),
      key: ranges?.["selection"].key ?? "selection",
    });
  };
  const resetSelectDate = () => {
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    });
  };
  return { selectionRange, handleSelectDate, resetSelectDate };
};

export default useDateSelect;
