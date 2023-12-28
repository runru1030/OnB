"use client";
import { useMutation } from "@apollo/client";
import { budget as budgetQuery } from "@app/lib/graphql/queries";
import Button from "@components/Button";
import { Input } from "@components/Input";
import Modal from "@components/Modal";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { BudgetQueryData } from "../_types";
import { useModal } from "./BudgetModal/Modal";

const EditBudgetModalWithTrigger = ({
  budget,
}: {
  budget: BudgetQueryData;
}) => {
  const router = useRouter();

  const { close: closeBudgetModal } = useModal();
  const [openAtom, setOpenAtom] = useState(false);
  const [newBudgetData, setNewBudgetData] = useState({ ...budget });
  const onChangeValueHandler = (
    e: ChangeEvent | React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    const { value, name } = e.target as HTMLInputElement | HTMLButtonElement;
    setNewBudgetData((p) => ({ ...p, [name]: value }));
  };

  const [updateBudget] = useMutation(budgetQuery.UPDATE_BUDGET, {
    onCompleted: () => {
      setOpenAtom(false);
      router.refresh();
    },
  });

  const [deleteBudget] = useMutation(budgetQuery.DELETE_BUDGET, {
    variables: { id: newBudgetData?.id },
    onCompleted: () => {
      closeBudgetModal();
      setOpenAtom(false);
      router.refresh();
    },
    refetchQueries: [budgetQuery.GET_BUDGET],
  });
  return (
    <Modal open={openAtom} onOpenChange={setOpenAtom}>
      <Modal.Trigger>
        <Button className="absolute top-1/2 left-4 !p-0 -translate-y-1/2 text-sm text-grey-400">
          관리
        </Button>
      </Modal.Trigger>
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
          <div className="flex flex-col flex-1 gap-8 p-4">
            <div className="flex flex-col gap-4">
              <Input
                placeholder="예산 이름"
                name="title"
                type="text"
                value={newBudgetData.title}
                onChange={onChangeValueHandler}
                required
                autoFocus
                maxLength={10}
                className="h-[42px] text-2xl outline-none border-b focus:border-b-2 border-grey-400 rounded-none !px-0 w-full"
              />
              <span className="text-xs font-normal text-grey-400 text-right">
                최대 10자
              </span>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">예산 종류</h2>
              <div className="flex">
                <Button
                  className={clsx(
                    newBudgetData.type === "CASH"
                      ? "btn-blue-grey"
                      : "text-grey-300",
                    "flex gap-1"
                  )}
                  onClick={onChangeValueHandler}
                  value={"CASH"}
                  name="type"
                >
                  <PaymentsTwoToneIcon />
                  현금
                </Button>
                <Button
                  className={clsx(
                    newBudgetData.type === "CARD"
                      ? "btn-blue-grey"
                      : "text-grey-300",
                    "flex gap-1"
                  )}
                  onClick={onChangeValueHandler}
                  value={"CARD"}
                  name="type"
                >
                  <PaymentTwoToneIcon />
                  카드
                </Button>
              </div>
            </div>
            <Button
              onClick={() => {
                deleteBudget({ variables: { id: newBudgetData?.id } });
              }}
              className="text-red text-left !p-0 text-sm"
            >
              예산 삭제하기
            </Button>
          </div>
          <Button
            className="btn-blue m-4 mb-6 sticky bottom-4"
            onClick={() => {
              updateBudget({ variables: { ...newBudgetData } });
            }}
          >
            저장
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};
export default EditBudgetModalWithTrigger;
