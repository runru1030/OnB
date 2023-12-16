import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import { BudgetQueryData } from "../_types";
interface BudgetBoxProps {
  budget: BudgetQueryData;
}
const BudgetBox = ({ budget }: BudgetBoxProps) => {
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
          <span>
            {(budget.totalIncomes - budget.totalExpenses).toLocaleString()}
          </span>
          <span className="text-grey-400">/</span>
          <span className="text-grey-400">
            {budget.totalIncomes.toLocaleString() ?? 0}
          </span>
          <span className="w-10">{budget.Currency.id}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetBox;
