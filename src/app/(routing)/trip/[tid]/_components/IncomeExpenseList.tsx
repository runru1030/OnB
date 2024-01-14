"use client";
import { dateformatter, getSumOfDetail } from "@app/utils";
import clsx from "clsx";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import currencySymbol from "../_constants/currencySymbol";
import { DetailDataType, DetailType } from "../_types";
import { ExpenseQueryData, IncomeQueryData } from "../detail/_types";
import CategoryTag from "./CategoryTag";
import DetailModal from "./DetailModal";
import Button from "@components/Button";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

interface IncomeExpenseListProps {
  dataList: (IncomeQueryData | ExpenseQueryData)[];
  withBudgetTitle?: boolean;
}
const IncomeExpenseList = ({
  dataList,
  withBudgetTitle = false,
}: IncomeExpenseListProps) => {
  const selectionMode = useAtomValue(selectionModeAtom);
  const [selectionDataRows, setSelectionDataRows] = useAtom(
    selectionDataRowsAtom
  );

  useEffect(() => {
    setSelectionDataRows(
      dataList.reduce(
        (a, c) => ({ ...a, [c.id]: { ...c, selected: false } }),
        {}
      )
    );
  }, [dataList, selectionMode]);

  const dataRowsByDate = useMemo(() => {
    const dataObj = {} as {
      [key: string]: DetailDataType[];
    };
    [...dataList]
      .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1))
      .forEach((el) => {
        const key = dateformatter(new Date(el.date));
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

    [...Object.keys(dataObj)].forEach((dateKey) => {
      dataObj[dateKey].sort((a, b) =>
        new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
      );
    });
    return dataObj;
  }, [dataList]);

  return (
    <>
      {Object.keys(dataRowsByDate).map((date: string) => (
        <div className="flex flex-col" key={date}>
          <span className="text-grey-200 px-4 py-2 text-sm tracking-wide border-b border-grey-50">
            {date}
          </span>
          <div className="flex flex-col">
            {dataRowsByDate[date].map((li) => (
              <DetailModal.Trigger
                className={clsx(
                  "w-full !p-0",
                  selectionDataRows[li.id]?.selected &&
                    (li.type === "Income" ? "bg-blue-50" : "bg-red-50")
                )}
                detail={li}
                key={li.id}
              >
                <div
                  onClick={(e) => {
                    if (selectionMode) {
                      setSelectionDataRows((p) => ({
                        ...p,
                        [li.id]: {
                          ...selectionDataRows[li.id],
                          selected: !selectionDataRows[li.id].selected,
                        },
                      }));
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="flex items-center justify-between !p-4"
                >
                  <div className="flex gap-4 items-center">
                    {withBudgetTitle && (
                      <span className="font-medium">{li?.Budget.title}</span>
                    )}
                    <span className="text-grey-300 max-w-[120px] truncate">
                      {li?.title}
                    </span>
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
                      {currencySymbol[li.Budget.Currency.id]}{" "}
                      {li.amount.toLocaleString()}
                    </span>
                  </span>
                </div>
              </DetailModal.Trigger>
            ))}
          </div>
        </div>
      ))}
      <DetailModal />
    </>
  );
};
const selectionModeAtom = atom(false);
const selectionDataRowsAtom = atom<{
  [key: string]: (IncomeQueryData | ExpenseQueryData) & {
    selected: boolean;
  };
}>({});
const SelectionManager = ({
  children,
  ...props
}: PropsWithChildren<React.ComponentProps<typeof Button>>) => {
  const setSelectionMode = useSetAtom(selectionModeAtom);
  useEffect(() => {
    return setSelectionMode(false);
  }, []);
  return (
    <Button onClick={() => setSelectionMode((p) => !p)} {...props}>
      {children}
    </Button>
  );
};

const useDataRowSelection = () => {
  const [selectionMode, setSelectionMode] = useAtom(selectionModeAtom);
  const [selectionDataRows, setSelectionDataRows] = useAtom(
    selectionDataRowsAtom
  );
  const {
    totalExpensesObj,
    totalExpensesKRW,
    totalIncomesObj,
    totalIncomesKRW,
  } = getSumOfDetail(
    Object.values(selectionDataRows).filter((row) => row.selected)
  );
  return {
    selectionMode,
    setSelectionMode,
    selectionDataRows,
    setSelectionDataRows,
    sumOfSelectionData: {
      totalExpensesObj,
      totalExpensesKRW,
      totalIncomesObj,
      totalIncomesKRW,
    },
  };
};
IncomeExpenseList.SelectionManager = SelectionManager;
IncomeExpenseList.useDataRowSelection = useDataRowSelection;
export default IncomeExpenseList;
