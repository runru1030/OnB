"use client";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import { BudgetQueryData } from "../_types";
import { useMemo } from "react";
import { getBudgetsSum } from "@app/utils";
interface BudgetBoxProps {
  budget: BudgetQueryData;
}
const BudgetBox = ({ budget }: BudgetBoxProps) => {
  const { totalIncomes, totalExpenses } = useMemo(
    () => getBudgetsSum(budget),
    [budget]
  );
  return (
    <div className="flex justify-between items-center" key={budget.id}>
      <h2 className="font-medium text-lg">{budget.title}</h2>
      <div className="flex items-center gap-2">
        <span className="text-sm text-grey-300">
          {
            {
              CASH: <PaymentsTwoToneIcon />,
              CARD: <PaymentTwoToneIcon />,
            }[budget.type]
          }
        </span>
        <div className="text-lg flex gap-0.5">
          <span className="font-medium">
            {(totalIncomes - totalExpenses).toLocaleString()}
          </span>
          <span className="">/</span>
          <span className="text-grey-300">
            {totalIncomes.toLocaleString() ?? 0}
          </span>
          <span className="pl-1">{budget.Currency.id}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetBox;
