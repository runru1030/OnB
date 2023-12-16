import { useMutation } from "@apollo/client";
import Button from "@components/Button";
import Modal from "@components/Modal";
import { DELETE_BUDGET } from "@lib/graphql/mutations";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";
import IncomeList from "./IncomeList";
import { tripAtom, tripStore } from "./TripProvider";

const modalOpenAtom = atom<boolean>(false);
const budgetIdAtom = atom<string>("");

const BudgetModal = () => {
  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const { budgets } = useAtomValue(tripAtom, { store: tripStore });
  const budgetId = useAtomValue(budgetIdAtom);

  const router = useRouter();
  const budget = useMemo(
    () => budgets.find((b) => b.id === budgetId),
    [budgets, budgetId]
  );

  const [deleteBudget] = useMutation(DELETE_BUDGET, {
    variables: { id: budgetId },
    onCompleted: () => {
      setOpenAtom(false);
      router.refresh();
    },
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
        <div className="flex flex-col gap-4 h-[calc(100%-60px)]">
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
            <div className="text-2xl flex gap-1 justify-end py-2 items-end">
              <span>
                {(
                  (budget?.totalIncomes || 0) - (budget?.totalExpenses || 0)
                ).toLocaleString()}
              </span>
              <span className="text-grey-400">/</span>
              <span className="text-grey-400">
                {budget?.totalIncomes.toLocaleString() ?? 0}
              </span>
              <span className="text-base">{budget?.Currency.id}</span>
            </div>
            <div className="flex justify-end">
              총 {budget?.totalIncomesKRW.toLocaleString()}원
            </div>
            <div className="flex justify-between items-center">
              <h2 className="">예산 종류</h2>
              <div className="flex gap-4">
                <div
                  className={clsx(
                    budget?.type === "CASH"
                      ? "btn-blue py-2 px-4"
                      : "text-grey-100",
                    "py-2 text-sm"
                  )}
                >
                  현금
                </div>
                <div
                  className={clsx(
                    budget?.type === "CARD"
                      ? "btn-blue pt-2 px-4"
                      : "text-grey-100",
                    "py-2 text-sm"
                  )}
                >
                  카드
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="">화폐</h2>
              <div className="flex gap-4">
                <span className="font-medium">{budget?.Currency.id}</span>
                <span>{budget?.Currency.name}</span>
              </div>
            </div>
            {budget?.incomes && budget?.incomes.length > 0 && (
              <IncomeList
                incomes={budget?.incomes}
                curencyUnit={budget?.Currency.id}
              />
            )}
          </div>
          <Button
            className="btn-red m-4"
            onClick={() => {
              deleteBudget({ variables: { id: budgetId } });
            }}
          >
            예산 삭제하기
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};
const BudgetModalTrigger = ({
  children,
  budgetId,
  ...props
}: PropsWithChildren<
  React.ComponentProps<typeof Button> & { budgetId: string }
>) => {
  const setOpenAtom = useSetAtom(modalOpenAtom);
  const setBudgetId = useSetAtom(budgetIdAtom);
  return (
    <Button
      onClick={(e) => {
        setOpenAtom(true);
        setBudgetId(budgetId);
        props?.onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
BudgetModal.Trigger = BudgetModalTrigger;
export default BudgetModal;
