"use client";
import { useMutation } from "@apollo/client";
import { expense, income } from "@app/lib/graphql/queries";
import { dateformatter } from "@app/utils";
import Button from "@components/Button";
import { Input } from "@components/Input";
import Modal from "@components/Modal";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import { Calendar } from "react-date-range";
import { EXPNSE_CATEGORY } from "../../_constants";
import { BudgetQueryData, DetailDataType, DetailType } from "../../_types";
import { ExpenseQueryData, IncomeQueryData } from "../../detail/_types";
import CategoryTag from "../CategoryTag";
import { NumericInput } from "@components/Input/Numeric";

const modalOpenAtom = atom<boolean>(false);
const detailAtom = atom<DetailDataType | undefined>(undefined);

const InternalDetailModal = () => {
  const router = useRouter();

  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const detailData = useAtomValue(detailAtom);

  const [deleteIncome] = useMutation(income.DELETE_INCOME, {
    variables: { id: detailData?.id },
    onCompleted: () => {
      setOpenAtom(false);
      router.refresh();
    },
  });
  const [deleteExpense] = useMutation(expense.DELETE_EXPENSE, {
    variables: { id: detailData?.id },
    onCompleted: () => {
      setOpenAtom(false);
      router.refresh();
    },
  });
  return (
    <Modal open={openAtom} onOpenChange={setOpenAtom}>
      <Modal.Content className="w-full top-[52px] bottom-0 translate-y-0 !p-0 rounded-b-none">
        <Modal.Title className="h-[60px]">
          <Button
            onClick={() => {
              detailData?.type === "Income"
                ? deleteIncome({
                    variables: {
                      id: detailData?.id,
                      budgetId: detailData?.budgetId,
                    },
                  })
                : deleteExpense({ variables: { id: detailData?.id } });
            }}
            className="text-red text-sm absolute top-1/2 left-4 -translate-y-1/2 flex gap-1 items-center !p-0"
          >
            삭제하기
          </Button>
          <Modal.Close>
            <Button className="absolute top-1/2 right-4 !p-0 -translate-y-1/2">
              <CloseSharpIcon />
            </Button>
          </Modal.Close>
        </Modal.Title>
        <div className="flex flex-col h-[calc(100%-60px)] overflow-auto">
          {
            {
              Income: <IcomeInputContent />,
              Expense: <ExpenseInputContent />,
            }[detailData?.type as DetailType]
          }
        </div>
      </Modal.Content>
    </Modal>
  );
};
export const Trigger = ({
  children,
  detail,
  ...props
}: PropsWithChildren<
  React.ComponentProps<typeof Button> & {
    detail: DetailDataType;
  }
>) => {
  const setOpenAtom = useSetAtom(modalOpenAtom);
  const setDetailData = useSetAtom(detailAtom);
  return (
    <Button
      {...props}
      onClick={(e) => {
        props?.onClick?.(e);
        setDetailData(detail);
        setOpenAtom(true);
      }}
    >
      {children}
    </Button>
  );
};

const IcomeInputContent = () => {
  const router = useRouter();
  const setOpenAtom = useSetAtom(modalOpenAtom);
  const [openCalendar, setOpenCalendar] = useState(false);
  const detailData = useAtomValue(detailAtom);
  const [newIncomeData, setNewIncomeData] = useState({
    ...(detailData as IncomeQueryData),
    amount: detailData?.amount
      .toString()
      .replace(
        /(\..*)$|(\d)(?=(\d{3})+(?!\d))/g,
        (digit, fract) => fract || digit + ","
      ),
    exchangeRate: (detailData as IncomeQueryData)?.exchangeRate
      .toString()
      .replace(
        /(\..*)$|(\d)(?=(\d{3})+(?!\d))/g,
        (digit, fract) => fract || digit + ","
      ),
  });
  const {
    id: currencyUnit,
    amountUnit,
    name: currencyName,
  } = (detailData?.Budget as BudgetQueryData).Currency;

  const [updateIncome] = useMutation(income.UPDATE_INCOME, {
    onCompleted: () => {
      router.refresh();
      setOpenAtom(false);
    },
  });
  const onUpdageIncome = () => {
    try {
      if (parseFloat(newIncomeData.amount as string) === 0)
        throw new Error("금액을 입력해주세요!");
      if (parseFloat(newIncomeData.exchangeRate) === 0)
        throw new Error("환율을 입력해주세요!");

      updateIncome({
        variables: {
          ...newIncomeData,
          amount: parseFloat(
            newIncomeData.amount?.replaceAll(",", "") as string
          ),
          exchangeRate: parseFloat(
            newIncomeData.exchangeRate.replaceAll(",", "") as string
          ),
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
    <>
      <div className="flex flex-col gap-4 flex-1 overflow-auto p-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span>{detailData?.Budget?.title}</span>
          <span>{currencyUnit} </span>
          <span className="text-sm text-grey-300">
            {
              {
                CASH: <PaymentsTwoToneIcon />,
                CARD: <PaymentTwoToneIcon />,
              }[detailData?.Budget?.type as "CASH" | "CARD"]
            }
          </span>
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <div className="relative h-10">
              <NumericInput
                value={newIncomeData?.amount}
                onChange={(e) => {
                  setNewIncomeData((p) => ({
                    ...p,
                    amount: e.target.value,
                  }));
                }}
                autoFocus
                placeholder={`0`}
                className="text-2xl font-medium outline-none focus:border-b-2 border-grey-400 rounded-none w-full px-0 pr-10 text-right"
                style={{
                  paddingRight: `${
                    (currencyName.split(" ").at(-1)?.length || 0) * 14 + 4
                  }px`,
                }}
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2">
                {currencyName.split(" ").at(-1)}
              </span>
            </div>
            <span className="flex items-center justify-end gap-1">
              {Math.ceil(
                ((parseInt(newIncomeData?.amount as string) || 0) *
                  (parseFloat(newIncomeData?.exchangeRate) || 0)) /
                  amountUnit
              ).toLocaleString()}
              <span className="text-sm">원</span>
            </span>
            <div className="flex items-center gap-2 text-grey-400">
              <span className="flex-1 text-right">{`${amountUnit} ${currencyName
                .split(" ")
                .at(-1)}`}</span>
              <span className="text-lg">=</span>
              <div className="relative h-[26px]">
                <NumericInput
                  type="number"
                  value={newIncomeData?.exchangeRate}
                  onChange={(e) => {
                    setNewIncomeData((p) => ({
                      ...p,
                      exchangeRate: e.target.value,
                    }));
                  }}
                  placeholder={newIncomeData?.exchangeRate}
                  className="outline-none focus:border-b-2 border-grey-400 rounded-none !p-0 !pr-4 text-right w-[100px] disabled:bg-white"
                  disabled={currencyUnit === "KRW"}
                />
                <span className="absolute right-0 top-[calc(50%-1px)] -translate-y-1/2">
                  원
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-[2vh]">
            <Input
              placeholder="항목명 (선택)"
              type="text"
              value={newIncomeData?.title}
              onChange={(e) =>
                setNewIncomeData((p) => ({ ...p, title: e.target.value }))
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
              <h2>일자</h2>
              <span
                className={clsx(
                  "font-medium tracking-wide duration-300",
                  openCalendar && "text-blue"
                )}
                onClick={() => setOpenCalendar((p) => !p)}
              >
                {dateformatter(new Date(detailData?.date || ""))}
              </span>
            </div>
            <div
              className={clsx(
                openCalendar ? "h-[330px]" : "h-0",
                "duration-300 overflow-hidden flex justify-center"
              )}
            >
              <Calendar
                date={new Date(detailData?.date || "")}
                onChange={(date) =>
                  setNewIncomeData((p) => ({ ...p, date: date }))
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        onClick={onUpdageIncome}
        className="btn-blue text-sm h-[40px] m-4"
      >
        저장
      </Button>
    </>
  );
};

const ExpenseInputContent = () => {
  const router = useRouter();
  const setOpenAtom = useSetAtom(modalOpenAtom);
  const [openCalendar, setOpenCalendar] = useState(false);
  const detailData = useAtomValue(detailAtom);
  const [newExpenseData, setNewExpenseData] = useState({
    ...(detailData as ExpenseQueryData),
    amount: detailData?.amount
      .toString()
      .replace(
        /(\..*)$|(\d)(?=(\d{3})+(?!\d))/g,
        (digit, fract) => fract || digit + ","
      ) as string,
  });
  const { id: currencyUnit, name: currencyName } = (
    detailData?.Budget as BudgetQueryData
  ).Currency;

  const [updateExpense] = useMutation(expense.UPDATE_EXPENSE, {
    onCompleted: () => {
      router.refresh();
      setOpenAtom(false);
    },
  });
  const onUpdageExpense = () => {
    try {
      if (parseFloat(newExpenseData.amount as string) === 0)
        throw new Error("금액을 입력해주세요!");

      updateExpense({
        variables: {
          ...newExpenseData,
          amount: parseFloat(
            newExpenseData.amount.replaceAll(",", "") as string
          ),
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
    <>
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span>{detailData?.Budget?.title}</span>
          <span>{currencyUnit} </span>
          <span className="text-sm text-grey-300">
            {
              {
                CASH: <PaymentsTwoToneIcon />,
                CARD: <PaymentTwoToneIcon />,
              }[detailData?.Budget?.type as "CASH" | "CARD"]
            }
          </span>
        </h2>
        <div className="flex flex-col gap-4">
          <div className="relative h-10 text-red">
            <NumericInput
              value={newExpenseData.amount}
              onChange={(e) => {
                setNewExpenseData((p) => ({
                  ...p,
                  amount: e.target.value,
                }));
              }}
              autoFocus
              placeholder={`0`}
              className="text-2xl font-medium outline-none focus:border-b-2 border-red rounded-none w-full px-0 pr-10 text-right placeholder:text-red-300"
              style={{
                paddingRight: `${
                  (currencyName.split(" ").at(-1)?.length || 0) * 14 + 4
                }px`,
              }}
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2">
              {currencyName.split(" ").at(-1)}
            </span>
          </div>
          <div className="flex border border-grey-50 rounded-md">
            {Object.keys(EXPNSE_CATEGORY).map((category) => (
              <Button
                key={category}
                className={clsx(
                  newExpenseData.category === category
                    ? "bg-grey-light-300 text-blue"
                    : "text-grey-300",
                  "duration-300"
                )}
                onClick={() =>
                  setNewExpenseData((p) => ({ ...p, category: category }))
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
              value={newExpenseData.title}
              onChange={(e) =>
                setNewExpenseData((p) => ({ ...p, title: e.target.value }))
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
                {dateformatter(new Date(newExpenseData.date))}
              </span>
            </div>
            <div
              className={clsx(
                openCalendar ? "h-[330px]" : "h-0",
                "duration-300 overflow-hidden flex justify-center"
              )}
            >
              <Calendar
                date={new Date(newExpenseData.date)}
                onChange={(date) =>
                  setNewExpenseData((p) => ({ ...p, date: date }))
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        onClick={onUpdageExpense}
        className="btn-blue text-sm h-[40px] m-4"
      >
        저장
      </Button>
    </>
  );
};
export default InternalDetailModal;
