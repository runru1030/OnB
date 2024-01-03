"use client";
import { getSumOfBudget } from "@app/utils";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import { useMemo, useState } from "react";
import CreateIncomeModal from "../../_components/CreateIncomeModal";
import { BudgetQueryData } from "../../_types";
import CreateExpenseModal from "../../_components/CreateExpenseModal";
import currencySymbol from "../../_constants/currencySymbol";
import GenerateDetails from "./GenerateDetails";

const BudgetInfoContent = ({ budget }: { budget: BudgetQueryData }) => {
  const [openMore, setOpenMore] = useState(false);
  const { totalIncomes, totalIncomesKRW, totalExpenses, totalExpensesKRW } =
    useMemo(() => getSumOfBudget(budget), [budget]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col pb-2">
        <div className="text-3xl flex gap-1 justify-end items-end">
          <span className="pr-1">
            {currencySymbol[budget?.Currency.id || ""]}
          </span>
          <span className=" font-medium">
            {((totalIncomes || 0) - (totalExpenses || 0)).toLocaleString()}
          </span>
          <span>/</span>
          <span className="text-grey-400">
            {totalIncomes?.toLocaleString() ?? 0}
          </span>
        </div>
        <span className="text-right text-sm text-grey-200">
          잔여 예산 / 총 예산
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xl text-red font-medium">
          {totalExpenses?.toLocaleString()}{" "}
          <span className="text-base">
            {budget?.Currency.name.split(" ").at(-1)} 지출
          </span>
        </span>
        <span className="text-base text-red-300">
          = {totalExpensesKRW?.toLocaleString()} 원
        </span>
      </div>

      <div className="flex w-full gap-4">
        <CreateIncomeModal withoutTrigger />
        <CreateIncomeModal.Trigger
          budget={budget}
          className="btn-grey-border bg-white w-full shadow-normal"
        >
          채우기
        </CreateIncomeModal.Trigger>
        <CreateExpenseModal withoutTrigger />
        <CreateExpenseModal.Trigger
          budget={budget}
          className="btn-red w-full shadow-normal"
        >
          지출하기
        </CreateExpenseModal.Trigger>
      </div>
      <GenerateDetails budget={budget} />
   
      <div className="flex flex-col">
        <div
          className="flex items-center text-grey-300"
          onClick={() => setOpenMore((p) => !p)}
        >
          예산 정보
          <KeyboardArrowDownSharpIcon
            className={clsx(
              !openMore ? "rotate-0" : "rotate-180",
              "duration-300 text-grey-300"
            )}
          />
        </div>
        <div
          className={clsx(
            openMore ? "h-[144px] pt-2" : "h-[0px]",
            "duration-300 overflow-hidden flex flex-col gap-2 text-grey-200"
          )}
        >
          <div className="flex justify-between items-center">
            <h2 className="">총 예산 (KRW)</h2>
            <span>{totalIncomesKRW?.toLocaleString()} 원</span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="">잔여 예산 (KRW)</h2>
            <span>
              {(totalIncomesKRW - totalExpensesKRW)?.toLocaleString()} 원
            </span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="">예산 종류</h2>
            <div className="flex gap-4">
              <div className={clsx("text-sm flex gap-2 items-center")}>
                {
                  {
                    CASH: (
                      <>
                        <PaymentsTwoToneIcon />
                        현금
                      </>
                    ),
                    CARD: (
                      <>
                        <PaymentTwoToneIcon />
                        카드
                      </>
                    ),
                  }[budget?.type as "CARD" | "CASH"]
                }
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="">통화</h2>
            <div className="flex gap-4">
              <span className="font-medium">{budget?.Currency.id}</span>
              <span>{budget?.Currency.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BudgetInfoContent;
