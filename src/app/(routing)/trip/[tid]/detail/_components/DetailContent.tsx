"use client";
import { useMutation } from "@apollo/client";
import { expense, income } from "@app/lib/graphql/queries";
import { getSumOfDetail } from "@app/utils";
import Button from "@components/Button";
import { NumericInput } from "@components/Input/Numeric";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import IncomeExpenseList from "../../_components/IncomeExpenseList";
import currencySymbol from "../../_constants/currencySymbol";
import { ExpenseQueryData, IncomeQueryData } from "../_types";
import FilterOptionModal from "./FilterOptionModal";

const DetailContent = ({
  dataList,
}: {
  dataList: (IncomeQueryData | ExpenseQueryData)[];
}) => {
  const { filteredDataList } = FilterOptionModal.useDataFilter({ dataList });
  const sumOfTotalData = getSumOfDetail(filteredDataList);
  const { selectionMode, sumOfSelectionData } =
    IncomeExpenseList.useDataRowSelection();

  const sumOfData = useMemo(() => {
    return selectionMode ? sumOfSelectionData : sumOfTotalData;
  }, [selectionMode, sumOfTotalData, sumOfSelectionData]);

  return (
    <div className="main-content flex flex-col px-0 gap-2">
      <FilterOptionModal />
      <div className="px-4 flex gap-2">
        <IncomeExpenseList.SelectionManager
          className={clsx(
            "border btn-grey-border text-sm",
            selectionMode ? "border-blue text-blue" : "border-grey-50 "
          )}
        >
          선택
        </IncomeExpenseList.SelectionManager>
        <FilterOptionModal.Trigger
          filterType="date"
          className="border border-grey-50 btn-grey-border text-sm"
        >
          기간
        </FilterOptionModal.Trigger>
        <FilterOptionModal.Trigger
          filterType="category"
          className="border border-grey-50 btn-grey-border text-sm"
        >
          카테고리
        </FilterOptionModal.Trigger>
        <FilterOptionModal.Trigger
          filterType="budgetType"
          className="border border-grey-50 btn-grey-border text-sm"
        >
          타입
        </FilterOptionModal.Trigger>
      </div>
      <SettlementManager />
      {filteredDataList.length !== 0 ? (
        <>
          <div className="flex-1">
            <IncomeExpenseList dataList={filteredDataList} withBudgetTitle />
          </div>
          <DetailAggregation sumOfData={sumOfData} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-grey-400 bg-grey-light-300">
          지출 및 충전 내역이 없습니다!
        </div>
      )}
    </div>
  );
};

const SettlementManager = () => {
  const [num, setNum] = useState(2);
  const [updateExpense] = useMutation(expense.UPDATE_EXPENSE);
  const [updateIncome] = useMutation(income.UPDATE_INCOME);
  const { selectionDataRows, setSelectionMode, selectionMode } =
    IncomeExpenseList.useDataRowSelection();

  const router = useRouter();
  return (
    <div
      className={clsx(
        "flex items-center px-4 justify-end duration-300 overflow-hidden",
        selectionMode ? "h-[40px]" : "h-0"
      )}
    >
      <NumericInput
        value={num.toString()}
        onChange={(e) => setNum(parseInt(e.target.value))}
        className="outline-none focus:border-b text-lg rounded-none text-center text-blue font-medium !py-0 w-[36px]"
      />
      <span className="text-blue-300">/ 1</span>
      <Button
        className="btn-blue bg-blue-50 text-blue ml-4"
        disabled={
          Object.values(selectionDataRows).filter((row) => row.selected)
            .length === 0
        }
        onClick={() => {
          Promise.all([
            ...Object.values(selectionDataRows)
              .filter((row) => row.selected && Object.hasOwn(row, "category"))
              .map((row) =>
                updateExpense({
                  variables: { ...row, amount: row.amount / num },
                })
              ),
            ...Object.values(selectionDataRows)
              .filter(
                (row) => row.selected && Object.hasOwn(row, "exchangeRate")
              )
              .map((row) =>
                updateIncome({
                  variables: { ...row, amount: row.amount / num },
                })
              ),
          ]).then(() => {
            setSelectionMode(false);
            router.refresh();
          });
        }}
      >
        정산하기
      </Button>
    </div>
  );
};

export const DetailAggregation = ({
  sumOfData,
  ...props
}: {
  sumOfData: {
    totalExpensesObj: {
      [key: string]: number;
    };
    totalExpensesKRW: number;
    totalIncomesObj: {
      [key: string]: number;
    };
    totalIncomesKRW: number;
  };
} & React.ComponentProps<"div">) => {
  const [openBottom, setOpenBottom] = useState(false);

  return (
    <div
      {...props}
      className={clsx(
        "sticky bottom-0 left-0 flex flex-col bg-white rounded-t-3xl w-full px-6 pb-8 gap-3 shadow-lg border border-grey-50",
        props.className
      )}
    >
      <div className="flex flex-col">
        <span
          className="!p-0 w-full flex justify-center"
          onClick={() => setOpenBottom((p) => !p)}
        >
          <hr className="my-3 border border-grey-100 w-12" />
        </span>
        <div className="flex gap-2">
          <span className="text-center text-blue flex-1">
            <span className="text-blue-300">충전</span>
            <br />
            {currencySymbol["KRW"]} {sumOfData.totalIncomesKRW.toLocaleString()}
          </span>
          <span className="text-center text-red flex-1">
            <span className="text-red-300">지출</span>
            <br />
            {currencySymbol["KRW"]}{" "}
            {sumOfData.totalExpensesKRW.toLocaleString()}
          </span>
        </div>
        <div
          className={clsx(
            "flex flex-col mt-4 pt-4 gap-1 overflow-scroll duration-300 border-grey-50",
            openBottom
              ? "h-[120px] border-t border-grey-200 pt-1"
              : "h-0 overflow-hidden"
          )}
        >
          {[
            ...new Set([
              ...Object.keys(sumOfData.totalExpensesObj),
              ...Object.keys(sumOfData.totalIncomesObj),
            ]),
          ].map((currency) => (
            <div key={currency} className="flex text-grey-400 items-center">
              {" "}
              <span className="flex-1">
                {sumOfData.totalIncomesObj[currency] ? (
                  <>
                    {currencySymbol[currency]}{" "}
                    {sumOfData.totalIncomesObj[currency]?.toLocaleString()}
                  </>
                ) : (
                  "-"
                )}
              </span>
              <span className="text-sm text-grey-100">{currency}</span>
              <span className="flex-1 text-right">
                {sumOfData.totalExpensesObj[currency] ? (
                  <>
                    {currencySymbol[currency]}{" "}
                    {sumOfData.totalExpensesObj[currency]?.toLocaleString()}
                  </>
                ) : (
                  "-"
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DetailContent;
