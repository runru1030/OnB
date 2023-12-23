"use client";
import { useMutation } from "@apollo/client";
import { dateformatter } from "@app/utils";
import Button from "@components/Button";
import { DELETE_EXPENSE, DELETE_INCOME } from "@app/lib/graphql/mutations";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ExpenseQueryData, IncomeQueryData } from "../detail/_types";
import CategoryTag from "./CategoryTag";
import ElementModal, { useElementModal } from "./ElementModal";
import { GET_TRIP } from "@app/lib/graphql/queries";

type DetailType = "Expense" | "Income";
type DataType = (IncomeQueryData | ExpenseQueryData) & {
  type: DetailType;
};
interface IncomeExpenseListProps {
  dataList: (IncomeQueryData | ExpenseQueryData)[];
}
const IncomeExpenseList = ({ dataList }: IncomeExpenseListProps) => {
  const router = useRouter();
  const {
    elementData,
    setElementData,
    setOpen: setOpenElementModal,
  } = useElementModal();
  const selectedElement = elementData as DataType;
  const dataByCreatedAt = useMemo(() => {
    const dataObj = {} as {
      [key: string]: DataType[];
    };
    dataList.forEach((el) => {
      const date = new Date(el.createdAt);
      const key = dateformatter(date);
      const li = {
        ...el,
        type: (Object.hasOwn(el, "category")
          ? "Expense"
          : "Income") as DetailType,
      };
      if (Object.hasOwn(dataObj, key)) {
        dataObj[key].push(li);
      } else {
        dataObj[key] = [li];
      }
    });
    return dataObj;
  }, [dataList]);

  const [deleteIncome] = useMutation(DELETE_INCOME, {
    variables: { id: selectedElement.id },
    onCompleted: () => {
      setOpenElementModal(false);
      router.refresh();
    },
    refetchQueries: [GET_TRIP],
  });
  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    variables: { id: selectedElement.id },
    onCompleted: () => {
      setOpenElementModal(false);
      router.refresh();
    },
    refetchQueries: [GET_TRIP],
  });
  return (
    <>
      {Object.keys(dataByCreatedAt).map((date: string) => (
        <div className="flex flex-col" key={date}>
          <span className="text-grey-200 px-4 py-2 text-sm tracking-wide border-b border-grey-50">
            {date}
          </span>
          <div className="flex flex-col">
            {dataByCreatedAt[date].map((li) => (
              <ElementModal.Trigger
                key={li.id}
                className={clsx(
                  "w-full flex items-center justify-between !p-4",
                  selectedElement?.id == li.id && "opacity-50 bg-grey-light-300"
                )}
                onClick={() => setElementData(li)}
              >
                <span className="font-medium">{li?.Budget.title}</span>
                <span
                  className={clsx(
                    li.type === "Expense" ? "text-red" : "text-blue",
                    "flex gap-4 items-center text-lg font-medium",
                    selectedElement?.id == li.id && "opacity-0"
                  )}
                >
                  <span className="text-red-300">
                    {li.type === "Expense" && (
                      <CategoryTag
                        category={(li as ExpenseQueryData).category}
                      />
                    )}
                  </span>
                  <span>
                    {li.type === "Expense" ? "- " : "+ "}
                    {li.amount.toLocaleString()} {li.Budget.currencyId}
                  </span>
                </span>
              </ElementModal.Trigger>
            ))}
          </div>
          <ElementModal className="-translate-x-[calc(100%+16px)] -translate-y-[50px]">
            <Button
              onClick={() => {
                selectedElement.type === "Income"
                  ? deleteIncome({ variables: { id: selectedElement.id } })
                  : deleteExpense({ variables: { id: selectedElement.id } });
              }}
              className="btn-red text-sm h-[40px]"
            >
              삭제하기
            </Button>
          </ElementModal>
        </div>
      ))}
    </>
  );
};
export default IncomeExpenseList;
