"use client";
import { getSumOfDetail } from "@app/utils";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";
import clsx from "clsx";
import { useState } from "react";
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
  const { totalExpensesObj, totalExpensesKRW } =
    getSumOfDetail(filteredDataList);
  const [openBottom, setOpenBottom] = useState(false);
  const { selectionMode } = IncomeExpenseList.useDataRowSelection();
  return (
    <div className="main-content flex flex-col px-0 gap-2">
      <FilterOptionModal />
      <div className="px-4 flex gap-2">
        <IncomeExpenseList.SelectionManager
          className={clsx(
            "border btn-grey-border text-sm pr-2.5",
            selectionMode ? "border-blue text-blue" : "border-grey-50 "
          )}
        >
          선택
          <KeyboardArrowDownSharpIcon />
        </IncomeExpenseList.SelectionManager>
        <FilterOptionModal.Trigger
          filterType="date"
          className="border border-grey-50 btn-grey-border text-sm pr-2.5"
        >
          기간
          <KeyboardArrowDownSharpIcon />
        </FilterOptionModal.Trigger>
        <FilterOptionModal.Trigger
          filterType="category"
          className="border border-grey-50 btn-grey-border text-sm pr-2.5"
        >
          카테고리
          <KeyboardArrowDownSharpIcon />
        </FilterOptionModal.Trigger>
        <FilterOptionModal.Trigger
          filterType="budgetType"
          className="border border-grey-50 btn-grey-border text-sm pr-2.5"
        >
          타입
          <KeyboardArrowDownSharpIcon />
        </FilterOptionModal.Trigger>
      </div>
      {filteredDataList.length !== 0 ? (
        <>
          <div className="flex-1">
            <IncomeExpenseList dataList={filteredDataList} withBudgetTitle />
          </div>
          <div className="sticky bottom-0 left-0 flex flex-col bg-red-50 rounded-t-3xl w-full px-6 pb-8 gap-3 shadow-normal ">
            <div className="flex flex-col">
              <span
                className="!p-0 w-full flex justify-center"
                onClick={() => setOpenBottom((p) => !p)}
              >
                <hr className="my-3 border border-red-100 w-12" />
              </span>
              <div className="flex pb-2 justify-center">
                <span className="font-medium text-lg text-red">
                  {currencySymbol["KRW"]} {totalExpensesKRW.toLocaleString()}{" "}
                  지출
                </span>
              </div>
              <div
                className={clsx(
                  "flex flex-col m-2 gap-1 overflow-scroll duration-300 border-red-300",
                  openBottom
                    ? "h-[100px] border-t border-red-300 pt-1"
                    : "h-0 overflow-hidden"
                )}
              >
                {Object.keys(totalExpensesObj).map((currency) => (
                  <div
                    key={currency}
                    className="flex text-red-300 justify-between"
                  >
                    <span>{currency}</span>
                    <span>
                      {currencySymbol[currency]}{" "}
                      {totalExpensesObj[currency].toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-grey-400 bg-grey-light-300">
          지출 및 충전 내역이 없습니다!
        </div>
      )}
    </div>
  );
};

export default DetailContent;
