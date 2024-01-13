"use client";
import { detectText } from "@app/lib/GCV/functions";
import Button from "@components/Button";
import Modal from "@components/Modal";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import clsx from "clsx";
import { ChangeEvent, useMemo, useState } from "react";
import currencySymbol from "../../_constants/currencySymbol";
import { BudgetQueryData } from "../../_types";
import { useMutation } from "@apollo/client";
import { expense, income } from "@app/lib/graphql/queries";
import { useParams, useRouter } from "next/navigation";
import DriveFolderUploadTwoToneIcon from "@mui/icons-material/DriveFolderUploadTwoTone";
import LoadingDots from "@components/LoadingDots";
const GenerateDetails = ({ budget }: { budget: BudgetQueryData }) => {
  const { tid } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [incomes, setIncomes] = useState<
    {
      date: string;
      value: number;
      selected: boolean;
    }[]
  >([]);
  const [expenses, setExpenses] = useState<
    {
      date: string;
      value: number;
      selected: boolean;
    }[]
  >([]);
  const [createIncomes] = useMutation(income.CREATE_INCOMES, {
    onError: (e) => {
      console.error(e);
    },
  });
  const [createExpenses] = useMutation(expense.CREATE_EXPENSES, {
    onError: (e) => {
      console.error(e);
    },
  });

  const targetIncomes = useMemo(
    () =>
      incomes
        .filter((i) => i.selected)
        .map((i) => ({
          title: "",
          exchangeRate: budget.exRateAVG,
          amount: i.value,
          date: new Date(i.date),
          budgetId: budget.id,
          tripId: tid,
        })),
    [incomes, budget, tid]
  );
  const targetExpenses = useMemo(
    () =>
      expenses
        .filter((i) => i.selected)
        .map((i) => ({
          title: "",
          category: "ETC",
          amount: i.value,
          date: new Date(i.date),
          budgetId: budget.id,
          tripId: tid,
        })),
    [expenses, budget, tid]
  );
  const onChangeHander = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const covertData = await detectText(
          reader.result as string,
          budget.Currency.id
        );
        setIncomes(
          covertData.incomes
            .filter((income) => income.value !== 0)
            .map((i) => ({
              ...i,
              selected: true,
            }))
        );
        setExpenses(
          covertData.expenses
            .filter((incomes) => incomes.value !== 0)
            .map((i) => ({
              ...i,
              selected: true,
            }))
        );
        setLoading(false);
      };
    }
    e.target.files = null;
  };
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Trigger>
        <Button className="btn-blue-border">이미지로 불러오기</Button>
      </Modal.Trigger>
      <Modal.Content
        className="w-full top-[52px] bottom-0 translate-y-0 !p-0 rounded-b-none"
        onOpenAutoFocus={() => {
          setExpenses([]);
          setIncomes([]);
          setLoading(false);
        }}
      >
        <Modal.Title className="p-4">
          <Modal.Close>
            <Button className="absolute top-1/2 right-4 !p-0 -translate-y-1/2">
              <CloseSharpIcon />
            </Button>
          </Modal.Close>
          이미지로 불러오기
        </Modal.Title>{" "}
        <div className="flex flex-col h-[calc(100%-60px)] overflow-auto">
          <div className="flex-1 p-4 flex flex-col gap-4">
            <label
              htmlFor="img"
              className="btn-blue-border bg-blue-200 flex items-center gap-4 justify-center"
            >
              <DriveFolderUploadTwoToneIcon />
              <span>이미지 업로드</span>
            </label>
            <input
              className="hidden"
              id="img"
              type="file"
              onChange={onChangeHander}
            />
            {loading && (
              <div className="flex items-center justify-center flex-1">
                <LoadingDots />
              </div>
            )}
            {!loading && (
              <div className="flex flex-col gap-4">
                {incomes.length !== 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">충전 내역</span>
                    <div className="flex flex-col rounded-xl overflow-hidden gap-1">
                      {incomes.map((income, idx) => (
                        <div
                          key={income.date + income.value}
                          className={clsx(
                            income.selected
                              ? "bg-blue-200 text-blue"
                              : "text-grey-100",
                            "flex justify-between p-2  duration-300"
                          )}
                          onClick={() => {
                            const temp = [...incomes];
                            temp[idx].selected = !temp[idx].selected;
                            setIncomes(temp);
                          }}
                        >
                          <span>{income.date}</span>
                          <span>
                            {currencySymbol[budget.Currency.id]}{" "}
                            {income.value.toLocaleString()}{" "}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {expenses.length !== 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">결제 내역</span>
                    <div className="flex flex-col rounded-xl overflow-hidden gap-1">
                      {expenses.map((expense, idx) => (
                        <div
                          key={expense.date + expense.value}
                          className={clsx(
                            expense.selected
                              ? "bg-red-100 text-red "
                              : "text-grey-100",
                            "flex justify-between p-2 duration-300"
                          )}
                          onClick={() => {
                            const temp = [...expenses];
                            temp[idx].selected = !temp[idx].selected;
                            setExpenses(temp);
                          }}
                        >
                          <span>{expense.date}</span>
                          <span>
                            {currencySymbol[budget.Currency.id]}{" "}
                            {expense.value.toLocaleString()}{" "}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <Button
            className="btn-blue m-4 mb-6 sticky bottom-4"
            disabled={targetIncomes.length + targetExpenses.length === 0}
            onClick={() => {
              Promise.all([
                createIncomes({
                  variables: {
                    incomes: targetIncomes,
                  },
                }),
                createExpenses({
                  variables: {
                    expenses: targetExpenses,
                  },
                }),
              ]).then(() => {
                router.refresh();
                setOpen(false);
              });
            }}
          >
            저장
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default GenerateDetails;
