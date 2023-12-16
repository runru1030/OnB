import { Expense, Income } from "@prisma/client";
import ElementModal, { useElementModal } from "./ElementModal";
import { useMutation } from "@apollo/client";
import { DELETE_EXPENSE, DELETE_INCOME } from "@lib/graphql/mutations";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { dateformatter } from "@app/utils";
import Button from "@components/Button";

interface IncomeExpenseListProps {
  datas: (Income | Expense)[];
  curencyUnit: string;
}
const IncomeExpenseList = ({ datas, curencyUnit }: IncomeExpenseListProps) => {
  const router = useRouter();
  const {
    elementData,
    setElementData,
    setOpen: setOpenElementModal,
  } = useElementModal();

  const [deleteIncome] = useMutation(DELETE_INCOME, {
    variables: { id: elementData?.id },
    onCompleted: () => {
      setOpenElementModal(false);
      router.refresh();
    },
  });
  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    variables: { id: elementData?.id },
    onCompleted: () => {
      setOpenElementModal(false);
      router.refresh();
    },
  });
  return (
    <div>
      {datas.map((data) => (
        <ElementModal.Trigger
          key={data.id}
          className={clsx(
            "w-full flex gap-1 py-2 justify-between !px-0",
            elementData?.id == data.id && "opacity-50",
            data.hasOwnProperty("exchangeRate") ? "text-blue" : "text-red"
          )}
          onClick={() => setElementData(data)}
        >
          <div className="flex gap-1 text-lg">
            <span>{data.hasOwnProperty("exchangeRate") ? "+" : "-"}</span>
            {data.amount.toLocaleString()}
            <span>{curencyUnit}</span>
          </div>
          <span className="text-grey-200 font-light">
            {dateformatter(new Date(data.createdAt))}
          </span>
        </ElementModal.Trigger>
      ))}
      <ElementModal className="-translate-y-[calc(44px)]">
        <Button
          onClick={() => {
            elementData.hasOwnProperty("exchangeRate")
              ? deleteIncome({ variables: elementData.id })
              : deleteExpense({ variables: elementData.id });
          }}
          className="btn-red text-sm h-[44px]"
        >
          삭제하기
        </Button>
      </ElementModal>
    </div>
  );
};
export default IncomeExpenseList;
