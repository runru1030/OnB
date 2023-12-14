import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import { extendedBudget } from "../_types";
interface BudgetBoxProps {
  budget: extendedBudget;
}
const BudgetBox = ({ budget }: BudgetBoxProps) => {
  return (
    <div className="flex justify-between items-center" key={budget.id}>
      <h2 className="font-medium text-lg">{budget.title}</h2>
      <div className="flex items-center gap-2">
        <div className="text-lg flex gap-0.5">
          <span>{budget.totalIncomes - budget.totalExpenses}</span>
          <span className="text-grey-400">/</span>
          <span className="text-grey-400">{budget.totalIncomes ?? 0}</span>
          <span className="w-12 pl-2">{budget.Currency.id}</span>
        </div>
        <span className="text-sm text-grey-300">
          {
            {
              CASH: <PaymentsTwoToneIcon />,
              CARD: <PaymentTwoToneIcon />,
            }[budget.type]
          }
        </span>
      </div>
    </div>
  );
};

export default BudgetBox;
