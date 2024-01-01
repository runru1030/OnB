"use client";
import { useQuery } from "@apollo/client";
import { budget } from "@app/lib/graphql/queries";
import { getSumOfBudget } from "@app/utils";
import Button from "@components/Button";
import Modal from "@components/Modal";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import { atom, useAtom, useSetAtom } from "jotai";
import dynamic from "next/dynamic";
import { PropsWithChildren, useMemo, useState } from "react";
import { BudgetQueryData } from "../../_types";
import EditBudgetModalWithTrigger from "../EditBudgetModalWithTrigger";
import CreateIncomeModal from "../CreateIncomeModal";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";
import CreateExpenseModal from "../CreateExpenseModal";
import currencySymbol from "../../_constants/currencySymbol";

const IncomeExpenseList = dynamic(() => import("../IncomeExpenseList"));
const modalOpenAtom = atom<boolean>(false);
const budgetAtom = atom<BudgetQueryData | undefined>(undefined);

export const useModal = () => {
  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  return { openAtom, setOpenAtom, close: () => setOpenAtom(false) };
};
const InternalBudgetModal = () => {
  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const [budgetData, setBudgetData] = useAtom(budgetAtom);
  const { totalIncomes, totalIncomesKRW, totalExpenses, totalExpensesKRW } =
    useMemo(() => getSumOfBudget(budgetData as BudgetQueryData), [budgetData]);
  const [openMore, setOpenMore] = useState(false);
  useQuery(budget.GET_BUDGET, {
    variables: { id: budgetData?.id },
    onCompleted: (data) => {
      setBudgetData(data.budget);
    },
  });

  return (
    <Modal open={openAtom} onOpenChange={setOpenAtom}>
      <Modal.Content
        className="w-full top-[52px] bottom-0 translate-y-0 !p-0 rounded-b-none"
        onCloseAutoFocus={() => setOpenMore(false)}
      >
        <Modal.Title className="p-4">
          <EditBudgetModalWithTrigger budget={budgetData as BudgetQueryData} />
          {budgetData?.title}
          <Modal.Close>
            <Button className="absolute top-1/2 right-4 !p-0 -translate-y-1/2">
              <CloseSharpIcon />
            </Button>
          </Modal.Close>
        </Modal.Title>{" "}
        <div className="flex flex-col h-[calc(100%-60px)] overflow-auto">
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-col pb-2">
              <div className="text-3xl flex gap-1 justify-end items-end">
                <span className="pr-1">
                  {currencySymbol[budgetData?.Currency.id || ""]}
                </span>
                <span className=" font-medium">
                  {(
                    (totalIncomes || 0) - (totalExpenses || 0)
                  ).toLocaleString()}
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
                - {totalExpenses?.toLocaleString()}{" "}
                <span className="text-base">
                  {budgetData?.Currency.name.split(" ").at(-1)}
                </span>
              </span>
              <span className="text-base text-red-300">
                = {totalExpensesKRW?.toLocaleString()} 원
              </span>
            </div>

            <div className="flex w-full gap-4">
              <CreateIncomeModal.Trigger
                budget={budgetData as BudgetQueryData}
                className="btn-grey-border bg-white w-full shadow-normal"
              >
                채우기
              </CreateIncomeModal.Trigger>
              <CreateExpenseModal.Trigger
                budget={budgetData as BudgetQueryData}
                className="btn-red w-full shadow-normal"
              >
                지출하기
              </CreateExpenseModal.Trigger>
            </div>
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
                        }[budgetData?.type as "CARD" | "CASH"]
                      }
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="">통화</h2>
                  <div className="flex gap-4">
                    <span className="font-medium">
                      {budgetData?.Currency.id}
                    </span>
                    <span>{budgetData?.Currency.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {(budgetData?.incomes || budgetData?.expenses) && (
              <IncomeExpenseList
                dataList={[...budgetData.incomes, ...budgetData.expenses]}
              />
            )}
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
};
export const Trigger = ({
  children,
  budget,
  ...props
}: PropsWithChildren<
  React.ComponentProps<typeof Button> & { budget: BudgetQueryData }
>) => {
  const setOpenAtom = useSetAtom(modalOpenAtom);
  const setBudget = useSetAtom(budgetAtom);
  return (
    <Button
      onClick={(e) => {
        setBudget(budget);
        setOpenAtom(true);
        props?.onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
export default InternalBudgetModal;
