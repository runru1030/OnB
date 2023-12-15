import Button from "@components/Button";
import Modal from "@components/Modal";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { PropsWithChildren } from "react";
import clsx from "clsx";
import { useMutation } from "@apollo/client";
import { DELETE_BUDGET } from "@lib/graphql/mutations";
import { useRouter } from "next/navigation";
import { BudgetQueryData } from "../_types";

const modalOpenAtom = atom<boolean>(false);
const budgetAtom = atom<BudgetQueryData | undefined>(undefined);

const BudgetModal = () => {
  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const budget = useAtomValue(budgetAtom);
  const router = useRouter();

  const [deleteBudget] = useMutation(DELETE_BUDGET, {
    variables: { id: budget?.id },
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">예산 종류</h2>
              <div className="flex gap-4">
                <div
                  className={clsx(
                    budget?.type === "CASH"
                      ? "btn-blue py-2 px-4"
                      : "text-grey-100",
                    "py-2"
                  )}
                >
                  현금
                </div>
                <div
                  className={clsx(
                    budget?.type === "CARD"
                      ? "btn-blue pt-2 px-4"
                      : "text-grey-100",
                    "py-2"
                  )}
                >
                  카드
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">화폐 단위</h2>
              <div className="flex gap-4">
                <span className="font-medium">{budget?.Currency.id}</span>
                <span>{budget?.Currency.name}</span>
              </div>
            </div>
          </div>
          <Button
            className="btn-red m-4"
            onClick={() => {
              deleteBudget({ variables: { id: budget?.id } });
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
  budget,
  ...props
}: PropsWithChildren<
  React.ComponentProps<typeof Button> & { budget: BudgetQueryData }
>) => {
  const setOpenAtom = useSetAtom(modalOpenAtom);
  const setBudgetAtom = useSetAtom(budgetAtom);
  return (
    <Button
      onClick={(e) => {
        setOpenAtom(true);
        setBudgetAtom(budget);
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
