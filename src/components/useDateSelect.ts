import { useState } from "react";
import { Range } from "react-date-range";
interface SelectionRange {
  [key: string]: Range;
}
const useDateSelect = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
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
