"use client";
import { getSumOfDetail } from "@app/utils";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";
import clsx from "clsx";
import { useMemo } from "react";
import IncomeExpenseList from "../../_components/IncomeExpenseList";
import { DetailAggregation } from "../../detail/_components/DetailContent";
import FilterOptionModal from "../../detail/_components/FilterOptionModal";
import { ExpenseQueryData, IncomeQueryData } from "../../detail/_types";

const DetailContent = ({
  dataList,
}: {
  dataList: (IncomeQueryData | ExpenseQueryData)[];
}) => {
  const { filteredDataList, filterMode } = FilterOptionModal.useDataFilter({
    dataList,
  });
  const sumOfTotalData = getSumOfDetail(filteredDataList);
  const { selectionMode, sumOfSelectionData } =
    IncomeExpenseList.useDataRowSelection();
  const sumOfData = useMemo(() => {
    return selectionMode ? sumOfSelectionData : sumOfTotalData;
  }, [selectionMode, sumOfTotalData, sumOfSelectionData]);

  return (
    <>
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
      </div>
      {filteredDataList.length !== 0 ? (
        <>
          <div className="flex-1">
            <IncomeExpenseList dataList={filteredDataList} />
          </div>
          <DetailAggregation
            sumOfData={sumOfData}
            className={clsx(filterMode || selectionMode ? "visible" : "hidden")}
          />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-grey-400 bg-grey-light-300">
          지출 및 충전 내역이 없습니다!
        </div>
      )}
    </>
  );
};

export default DetailContent;
