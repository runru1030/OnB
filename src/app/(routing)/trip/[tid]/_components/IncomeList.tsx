import { Income } from "@prisma/client";
import ElementModal, { useElementModal } from "./ElementModal";
import { useMutation } from "@apollo/client";
import { DELETE_INCOME } from "@lib/graphql/mutations";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { dateformatter } from "@app/utils";
import Button from "@components/Button";

interface IncomeListProps {
  incomes: Income[];
  curencyUnit: string;
}
const IncomeList = ({ incomes, curencyUnit }: IncomeListProps) => {
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
  return (
    <div>
      {incomes.map((income) => (
        <ElementModal.Trigger
          key={income.id}
          className={clsx(
            "w-full flex gap-1 py-2 justify-between text-blue !px-0",
            elementData?.id == income.id && "opacity-50"
          )}
          onClick={() => setElementData(income)}
        >
          <div className="flex gap-1 text-lg">
            + {income.amount.toLocaleString()}
            <span>{curencyUnit}</span>
          </div>
          <span className="text-grey-200 font-light">
            {dateformatter(new Date(income.createdAt))}
          </span>
        </ElementModal.Trigger>
      ))}
      <ElementModal className="-translate-y-[calc(44px)]">
        <Button
          onClick={() => {
            deleteIncome({ variables: elementData.id });
          }}
          className="btn-red text-sm h-[44px]"
        >
          삭제하기
        </Button>
      </ElementModal>
    </div>
  );
};
export default IncomeList;
