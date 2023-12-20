"use client";
import { useMutation } from "@apollo/client";
import { dateformatter } from "@app/utils";
import Button from "@components/Button";
import { Input } from "@components/Input";
import StepModal from "@components/Modal/StepModal";
import { CREATE_EXPENSE } from "@lib/graphql/mutations";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar } from "react-date-range";
import { EXPNSE_CATEGORY } from "../_constants";
import BudgetBox from "./BudgetBox";
import CategoryTag from "./CategoryTag";
import { tripAtom, tripStore } from "./TripProvider";
const budgetAtom = atomWithReset({
  id: "",
  Currency: { id: "", name: "", countryId: "", amountUnit: 1 },
  title: "",
  type: "CASH",
  totalExpenses: 0,
  totalIncomes: 0,
  totalIncomesKRW: 0,
});
const expenseReqAtom = atomWithReset({
  amount: "0",
  category: "ETC",
  createdAt: new Date(),
});

const CreateExpenseModal = () => {
  const router = useRouter();

  const budgetData = useAtomValue(budgetAtom);
  const expenseData = useAtomValue(expenseReqAtom);
  const resetBudgetData = useResetAtom(budgetAtom);
  const resetExpenseData = useResetAtom(expenseReqAtom);

  const { id } = useAtomValue(tripAtom, { store: tripStore });
  const [createExpense] = useMutation(CREATE_EXPENSE, {
    onCompleted: () => {
      router.refresh();
    },
  });

  const onCreateExpense = () => {
    try {
      if (parseInt(expenseData.amount) === 0)
        throw new Error("금액을 입력해주세요!");
      if (expenseData.category === "")
        throw new Error("카테고리를 선택해주세요!");

      createExpense({
        variables: {
          ...expenseData,
          amount: parseInt(expenseData.amount),
          budgetId: budgetData.id,
          tripId: id,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        alert(error.message);
      }
    }
  };
  return (
    <StepModal>
      <StepModal.Trigger>
        <Button className="btn-red w-full">지출 기록하기</Button>
      </StepModal.Trigger>
      <StepModal.Content
        onCloseAutoFocus={() => {
          resetBudgetData();
          resetExpenseData();
        }}
      >
        <StepModal.Title>지출 기록하기</StepModal.Title>
        <StepModal.StepSection
          stepContentList={[
            {
              content: <SelectBudgetContent />,
              nextButton: (
                <StepModal.StepNext
                  requiredCondition={{
                    condition: !budgetData,
                    description: "지출할 예산을 선택해주세요!",
                  }}
                >
                  다음
                </StepModal.StepNext>
              ),
            },
            {
              content: <ExpenseInputContent />,
              nextButton: (
                <StepModal.StepNext onNextStepHandler={onCreateExpense}>
                  지출 기록하기
                </StepModal.StepNext>
              ),
            },
          ]}
        />
      </StepModal.Content>
    </StepModal>
  );
};

export default CreateExpenseModal;

const SelectBudgetContent = () => {
  const { budgets } = useAtomValue(tripAtom, { store: tripStore });
  const [budgetData, setBudgetData] = useAtom(budgetAtom);

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          {budgets.map((budget) => (
            <div
              onClick={() => {
                setBudgetData(budget);
              }}
              className={clsx(
                budget.id === budgetData?.id &&
                  "bg-grey-light-400 [&>div>h2]:text-blue",
                "rounded-lg duration-300 p-2"
              )}
              key={budget.id}
            >
              <BudgetBox budget={budget} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const ExpenseInputContent = () => {
  const [expenseData, setExpenseData] = useAtom(expenseReqAtom);
  const budgetData = useAtomValue(budgetAtom);

  const [openCalendar, setOpenCalendar] = useState(false);
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span>{budgetData.title}</span>
          <span>{budgetData.Currency.id} </span>
          <span className="text-sm text-grey-300">
            {
              {
                CASH: <PaymentsTwoToneIcon />,
                CARD: <PaymentTwoToneIcon />,
              }[budgetData.type as "CASH" | "CARD"]
            }
          </span>
        </h2>
        <div className="flex flex-col gap-4">
          <div className="relative h-10 text-red">
            <Input
              type="number"
              value={expenseData.amount}
              onChange={(e) => {
                setExpenseData((p) => ({
                  ...p,
                  amount: e.target.value.replace(/(^0+)/, ""),
                }));
              }}
              autoFocus
              placeholder={`0`}
              className="text-2xl font-medium outline-none focus:border-b-2 border-red rounded-none w-full px-0 pr-8 text-right"
              onKeyDown={(e) => {
                if (e.key === "." || e.key === "e") e.preventDefault();
              }}
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2">
              {budgetData.Currency.id}
            </span>
          </div>
          <div className="text-xl flex gap-1 justify-end py-2 items-end">
            <span className="text-red-300">
              {(
                (budgetData?.totalIncomes || 0) -
                (budgetData?.totalExpenses + parseInt(expenseData.amount) || 0)
              ).toLocaleString()}
            </span>
            <span className="text-red-300 text-base">/</span>
            <span className="text-grey-300 text-base">
              {budgetData?.totalIncomes.toLocaleString() ?? 0}
            </span>
            <span className="text-grey-300 text-base">
              {budgetData.Currency.id}
            </span>
          </div>
          <div className="flex border border-grey-50 rounded-md">
            {Object.keys(EXPNSE_CATEGORY).map((category) => (
              <Button
                key={category}
                className={clsx(
                  expenseData.category === category
                    ? "bg-grey-light-300 text-blue"
                    : "text-grey-300",
                  "duration-300"
                )}
                onClick={() =>
                  setExpenseData((p) => ({ ...p, category: category }))
                }
              >
                <CategoryTag category={category} withDescription />
              </Button>
            ))}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between text-grey-300">
              <h2>지출일</h2>
              <span
                className={clsx(
                  "font-medium tracking-wide duration-300",
                  openCalendar && "text-blue"
                )}
                onClick={() => setOpenCalendar((p) => !p)}
              >
                {dateformatter(new Date(expenseData.createdAt))}
              </span>
            </div>
            <div
              className={clsx(
                openCalendar ? "h-[330px]" : "h-0",
                "duration-300 overflow-hidden flex justify-center"
              )}
            >
              <Calendar
                date={expenseData.createdAt}
                onChange={(date) =>
                  setExpenseData((p) => ({ ...p, createdAt: date }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
