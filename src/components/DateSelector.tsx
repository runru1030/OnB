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
// const StyledDateRange = styled(DateRange)`
//   .rdrDateDisplayWrapper {
//     display: none;
//   }
//   background-color: ${({ theme }) => theme.colors.gray100}50;
//   .rdrDay {
//     color: ${({ theme }) => theme.colors.white};
//   }
//   .rdrDayToday .rdrDayNumber span:after {
//     background: ${({ theme }) => theme.colors.primary};
//   }
//   .rdrDayNumber span {
//     color: ${({ theme }) => theme.colors.white};
//   }
//   .rdrWeekDay {
//     color: ${({ theme }) => theme.colors.primary200};
//   }
//   .rdrDayPassive .rdrDayNumber span {
//     color: ${({ theme }) => theme.colors.gray300};
//   }
//   .rdrNextPrevButton {
//     background: ${({ theme }) => theme.colors.primary200}50;
//     i {
//       border-color: transparent transparent transparent white;
//     }
//   }
//   .rdrPprevButton {
//     i {
//       border-color: transparent white transparent transparent;
//     }
//   }
//   .rdrStartEdge {
//     color: ${({ theme }) => theme.colors.primary} !important;
//   }
//   .rdrInRange {
//     color: ${({ theme }) => theme.colors.primary} !important;
//   }
//   .rdrEndEdge {
//     color: ${({ theme }) => theme.colors.primary} !important;
//   }
//   .rdrMonthAndYearPickers select {
//     color: ${({ theme }) => theme.colors.white};
//     /* background-color: red; */
//     background-image: url("data:image/svg+xml,%3Csvg width='384' height='512' viewBox='0 0 384 512' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_108_62)'%3E%3Cpath d='M192 384C183.812 384 175.62 380.875 169.38 374.625L9.38 214.625C-3.12 202.125 -3.12 181.875 9.38 169.375C21.88 156.875 42.13 156.875 54.63 169.375L192 306.8L329.4 169.4C341.9 156.9 362.15 156.9 374.65 169.4C387.15 181.9 387.15 202.15 374.65 214.65L214.65 374.65C208.4 380.9 200.2 384 192 384Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_108_62'%3E%3Crect width='384' height='512' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
//     background-size: 12px 12px;
//     opacity: 0.8;
//   }
// `;
