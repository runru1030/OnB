"use client";
import { useMutation } from "@apollo/client";
import { expense, trip } from "@app/lib/graphql/queries";
import { dateformatter, getSumOfBudget } from "@app/utils";
import Button from "@components/Button";
import { Input } from "@components/Input";
import StepModal from "@components/Modal/StepModal";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import { useParams, useRouter } from "next/navigation";
import { PropsWithChildren, useMemo, useState } from "react";
import { Calendar } from "react-date-range";
import { EXPNSE_CATEGORY } from "../_constants";
import currencySymbol from "../_constants/currencySymbol";
import { BudgetQueryData } from "../_types";
import { ExpenseQueryData, IncomeQueryData } from "../detail/_types";
import BudgetBox from "./BudgetBox";
import CategoryTag from "./CategoryTag";
import { tripAtom, tripStore } from "./TripProvider";
import { NumericInput } from "@components/Input/Numeric";
const budgetAtom = atomWithReset({
  id: "",
  Currency: { id: "", name: "", amountUnit: 1 },
  title: "",
  type: "CASH",
  incomes: [] as IncomeQueryData[],
  expenses: [] as ExpenseQueryData[],
});
const expenseReqAtom = atomWithReset({
  title: "",
  amount: "",
  category: "ETC",
  date: new Date(),
});

const modalOpenAtom = atom<boolean>(false);
const CreateExpenseModal = ({
  withoutTrigger,
}: {
  withoutTrigger?: boolean;
}) => {
  const router = useRouter();
  const { tid } = useParams();

  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const budgetData = useAtomValue(budgetAtom);
  const expenseData = useAtomValue(expenseReqAtom);
  const resetBudgetData = useResetAtom(budgetAtom);
  const resetExpenseData = useResetAtom(expenseReqAtom);

  const [createExpense] = useMutation(expense.CREATE_EXPENSE, {
    onCompleted: () => {
      router.refresh();
    },
    refetchQueries: [trip.GET_TRIP],
  });

  const onCreateExpense = () => {
    try {
      if (parseFloat(expenseData.amount) === 0)
        throw new Error("금액을 입력해주세요!");
      if (expenseData.category === "")
        throw new Error("카테고리를 선택해주세요!");

      createExpense({
        variables: {
          ...expenseData,
          amount: parseFloat(expenseData.amount.replaceAll(",", "")),
          budgetId: budgetData.id,
          tripId: tid,
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
    <StepModal open={openAtom} onOpenChange={setOpenAtom}>
      {!withoutTrigger && (
        <StepModal.Trigger>
          <Button className="btn-red w-full shadow-normal">지출하기</Button>
        </StepModal.Trigger>
      )}
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
              toNext: budgetData.id !== "",
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
  const setBudgetData = useSetAtom(budgetAtom);

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-2">
        {budgets.map((budget) => (
          <div
            onClick={() => {
              setBudgetData(budget);
            }}
            className={clsx("duration-300 py-2")}
            key={budget.id}
          >
            <BudgetBox budget={budget} />
          </div>
        ))}
      </div>
    </div>
  );
};
const ExpenseInputContent = () => {
  const [expenseData, setExpenseData] = useAtom(expenseReqAtom);
  const budgetData = useAtomValue(budgetAtom);

  const [openCalendar, setOpenCalendar] = useState(false);
  const { totalIncomes, totalExpenses } = useMemo(
    () => getSumOfBudget(budgetData as BudgetQueryData),
    [budgetData]
  );
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
            <NumericInput
              value={expenseData.amount}
              onChange={(e) => {
                setExpenseData((p) => ({
                  ...p,
                  amount: e.target.value,
                }));
              }}
              autoFocus
              id="step-2"
              placeholder={`0`}
              className="text-2xl font-medium outline-none focus:border-b-2 border-red rounded-none w-full px-0 pr-10 text-right placeholder:text-red-300"
              style={{
                paddingRight: `${
                  (budgetData.Currency.name.split(" ").at(-1)?.length || 0) *
                    14 +
                  4
                }px`,
              }}
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2">
              {budgetData.Currency.name.split(" ").at(-1)}
            </span>
          </div>
          <div className="text-xl flex gap-1 justify-end py-2 items-end">
            <span className="text-red-300">
              {currencySymbol[budgetData.Currency.id]}
            </span>
            <span className="text-red-300">
              {(
                (totalIncomes || 0) -
                (totalExpenses + parseFloat(expenseData.amount) || 0)
              ).toLocaleString()}
            </span>
            <span className="text-red-300 text-base">/</span>
            <span className="text-grey-300 text-base">
              {totalIncomes.toLocaleString() ?? 0}
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
          <div className="flex flex-col gap-1">
            <Input
              placeholder="항목명 (선택)"
              type="text"
              value={expenseData.title}
              onChange={(e) =>
                setExpenseData((p) => ({ ...p, title: e.target.value }))
              }
              maxLength={10}
              className="h-[34px] outline-none focus:border-b-2 border-grey-400 rounded-none !px-0 w-full text-right"
            />
            <span className="text-xs font-normal text-grey-400 text-right">
              최대 10자
            </span>
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
                {dateformatter(new Date(expenseData.date))}
              </span>
            </div>
            <div
              className={clsx(
                openCalendar ? "h-[330px]" : "h-0",
                "duration-300 overflow-hidden flex justify-center"
              )}
            >
              <Calendar
                date={expenseData.date}
                onChange={(date) => setExpenseData((p) => ({ ...p, date }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
CreateExpenseModal.Trigger = Trigger;
