import React from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

interface IProps {
  ranges: Range[] | undefined;
  onChange: ((rangesByKey: RangeKeyDict) => void) | undefined;
}
const DateSelector: React.FC<IProps> = ({ ranges, onChange }) => {
  return <DateRange editableDateInputs={true} {...{ ranges, onChange }} />;
};

export default DateSelector;
