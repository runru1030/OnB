"use client";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_BUDGET } from "@app/lib/graphql/mutations";
import { GET_BUDGET } from "@app/lib/graphql/queries";
import Button from "@components/Button";
import Modal from "@components/Modal";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";
import { BudgetQueryData } from "../../_types";
import { getBudgetsSum } from "@app/utils";

const IncomeExpenseList = dynamic(() => import("../IncomeExpenseList"));
const modalOpenAtom = atom<boolean>(false);
const budgetAtom = atom<BudgetQueryData | undefined>(undefined);

const InternalBudgetModal = () => {
  const router = useRouter();

  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const budgetData = useAtomValue(budgetAtom);
  const { data, loading } = useQuery(GET_BUDGET, {
    variables: { id: budgetData?.id },
  });
  const budget = loading ? budgetData : data?.budget;
  const { totalIncomes, totalIncomesKRW, totalExpenses, totalExpensesKRW } =
    useMemo(() => getBudgetsSum(budget as BudgetQueryData), [budget]);

  const [deleteBudget] = useMutation(DELETE_BUDGET, {
    variables: { id: budgetData?.id },
    onCompleted: () => {
      setOpenAtom(false);
      router.refresh();
    },
    refetchQueries: [GET_BUDGET],
  });
  return (
    <Modal open={openAtom} onOpenChange={setOpenAtom}>
      <Modal.Content className="w-full top-[52px] bottom-0 translate-y-0 !p-0 rounded-b-none">
        <Modal.Title className="p-4">
          {budget?.title}
          <Modal.Close>
            <Button className="absolute top-1/2 right-4 !p-0 -translate-y-1/2">
              <CloseSharpIcon />
            </Button>
          </Modal.Close>
        </Modal.Title>{" "}
        <div className="flex flex-col h-[calc(100%-60px)] overflow-auto">
          <div className="flex-1">
            <div className="p-4 flex flex-col gap-4">
              <div className="text-3xl flex gap-1 justify-end items-end pb-2">
                <span className=" font-medium">
                  {(
                    (totalIncomes || 0) - (totalExpenses || 0)
                  ).toLocaleString()}
                </span>
                <span>/</span>
                <span className="text-grey-400">
                  {totalIncomes?.toLocaleString() ?? 0}
                </span>
                <span className="text-base">{budget?.Currency.id}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-medium">
                  총 예산 {totalIncomes?.toLocaleString()} {budget?.Currency.id}
                </span>
                <span className="text-sm">
                  = {totalIncomesKRW?.toLocaleString()} 원
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-medium">
                  총 지출 {totalExpenses?.toLocaleString()}{" "}
                  {budget?.Currency.id}
                </span>
                <span className="text-sm">
                  = {totalExpensesKRW?.toLocaleString()} 원
                </span>
              </div>
              <div className="flex justify-between items-center text-grey-300">
                <h2 className="">예산 종류</h2>
                <div className="flex gap-4">
                  <div className={clsx("py-2 text-sm flex gap-2 items-center")}>
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
              <div className="flex justify-between items-center text-grey-300">
                <h2 className="">화폐</h2>
                <div className="flex gap-4">
                  <span className="font-medium">{budget?.Currency.id}</span>
                  <span>{budget?.Currency.name}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {(budget?.incomes || budget?.expenses) && (
                <IncomeExpenseList
                  dataList={[...budget.incomes, ...budget.expenses]}
                />
              )}
            </div>
          </div>
          <Button
            className="btn-red m-4 sticky bottom-4"
            onClick={() => {
              deleteBudget({ variables: { id: budget.id } });
            }}
          >
            예산 삭제하기
          </Button>
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
