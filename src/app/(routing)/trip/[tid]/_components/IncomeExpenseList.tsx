"use client";
import { dateformatter } from "@app/utils";
import clsx from "clsx";
import { useMemo } from "react";
import { DetailDataType, DetailType } from "../_types";
import { ExpenseQueryData, IncomeQueryData } from "../detail/_types";
import CategoryTag from "./CategoryTag";
import DetailModal from "./DetailModal";

interface IncomeExpenseListProps {
  dataList: (IncomeQueryData | ExpenseQueryData)[];
  withBudgetTitle?: boolean;
}
const IncomeExpenseList = ({
  dataList,
  withBudgetTitle = false,
}: IncomeExpenseListProps) => {
  const dataByCreatedAt = useMemo(() => {
    const dataObj = {} as {
      [key: string]: DetailDataType[];
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

  return (
    <>
      {Object.keys(dataByCreatedAt).map((date: string) => (
        <div className="flex flex-col" key={date}>
          <span className="text-grey-200 px-4 py-2 text-sm tracking-wide border-b border-grey-50">
            {date}
          </span>
          <div className="flex flex-col">
            {dataByCreatedAt[date].map((li) => (
              <DetailModal.Trigger
                key={li.id}
                className={clsx(
                  "w-full flex items-center justify-between !p-4"
                )}
                detail={li}
              >
                <div className="flex gap-4 items-center">
                  {withBudgetTitle && (
                    <span className="font-medium">{li?.Budget.title}</span>
                  )}
                  <span className="text-grey-300">{li?.title}</span>
                </div>
                <span
                  className={clsx(
                    li.type === "Expense" ? "text-red" : "text-blue",
                    "flex gap-4 items-center text-lg font-medium"
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
              </DetailModal.Trigger>
            ))}
          </div>
        </div>
      ))}
      <DetailModal />
    </>
  );
};
export default IncomeExpenseList;
