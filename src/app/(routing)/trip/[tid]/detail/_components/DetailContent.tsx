"use client";
import IncomeExpenseList from "../../_components/IncomeExpenseList";
import { ExpenseQueryData, IncomeQueryData } from "../_types";
import FilterOptionModal from "./FilterOptionModal";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";

const DetailContent = ({
  dataList,
}: {
  dataList: (IncomeQueryData | ExpenseQueryData)[];
}) => {
  const { filteredDataList } = FilterOptionModal.useDataFilter({ dataList });

  return (
    <div className="main-content flex flex-col px-0 gap-2">
      <FilterOptionModal />
      <div className="px-4 flex gap-2">
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
        <IncomeExpenseList dataList={filteredDataList} withBudgetTitle />
      ) : (
        <div className="flex flex-1 items-center justify-center text-grey-400 bg-grey-light-300">
          지출 및 충전 내역이 없습니다!
        </div>
      )}
    </div>
  );
};

export default DetailContent;
