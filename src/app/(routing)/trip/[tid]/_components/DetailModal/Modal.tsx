"use client";
import { useMutation } from "@apollo/client";
import {
  DELETE_EXPENSE,
  DELETE_INCOME,
  UPDATE_EXPENSE,
  UPDATE_INCOME,
} from "@app/lib/graphql/mutations";
import { dateformatter } from "@app/utils";
import Button from "@components/Button";
import { Input } from "@components/Input";
import Modal from "@components/Modal";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import { Calendar } from "react-date-range";
import { EXPNSE_CATEGORY } from "../../_constants";
import { BudgetQueryData, DetailDataType, DetailType } from "../../_types";
import { ExpenseQueryData, IncomeQueryData } from "../../detail/_types";
import CategoryTag from "../CategoryTag";

const modalOpenAtom = atom<boolean>(false);
const detailAtom = atom<DetailDataType | undefined>(undefined);

const InternalDetailModal = () => {
  const router = useRouter();

  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const detailData = useAtomValue(detailAtom);

  const [deleteIncome] = useMutation(DELETE_INCOME, {
    variables: { id: detailData?.id },
    onCompleted: () => {
      setOpenAtom(false);
      router.refresh();
    },
  });
  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
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
                ? deleteIncome({ variables: { id: detailData?.id } })
                : deleteExpense({ variables: { id: detailData?.id } });
            }}
            className="text-red-300 text-sm absolute top-1/2 left-4 -translate-y-1/2 flex gap-1 items-center !p-0"
          >
            삭제
            <RemoveCircleTwoToneIcon sx={{ fontSize: 16 }} />
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
      onClick={(e) => {
        setDetailData(detail);
        setOpenAtom(true);
        props?.onClick?.(e);
      }}
      {...props}
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
    amount: detailData?.amount.toString(),
    exchangeRate: (detailData as IncomeQueryData)?.exchangeRate.toString(),
  });
  const { id: currencyUnit, amountUnit } = (
    detailData?.Budget as BudgetQueryData
  ).Currency;

  const [updateIncome] = useMutation(UPDATE_INCOME, {
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
          amount: parseFloat(newIncomeData.amount as string),
          exchangeRate: parseFloat(newIncomeData.exchangeRate as string),
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
              <Input
                type="number"
                value={newIncomeData?.amount}
                onChange={(e) => {
                  setNewIncomeData((p) => ({
                    ...p,
                    amount: e.target.value.replace(/(^0+)/, ""),
                  }));
                }}
                autoFocus
                placeholder={`0`}
                className="text-2xl font-medium outline-none focus:border-b-2 border-grey-400 rounded-none w-full px-0 pr-10 text-right"
                onKeyDown={(e) => {
                  if (e.key === "e") e.preventDefault();
                }}
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2">
                {currencyUnit}
              </span>
            </div>
            <span className="flex items-center justify-end gap-2">
              {Math.ceil(
                ((parseInt(newIncomeData?.amount as string) || 0) *
                  (parseFloat(newIncomeData?.exchangeRate) || 0)) /
                  amountUnit
              ).toLocaleString()}{" "}
              <span className="text-sm">원</span>
            </span>
            <div className="flex items-center gap-2 text-grey-400">
              <span className="flex-1 text-right">{`${amountUnit} ${currencyUnit}`}</span>
              <span className="text-lg">=</span>
              <div className="relative">
                <Input
                  type="number"
                  value={newIncomeData?.exchangeRate}
                  onChange={(e) => {
                    setNewIncomeData((p) => ({
                      ...p,
                      exchangeRate: e.target.value.replace(/(^0+)/, ""),
                    }));
                  }}
                  placeholder={newIncomeData?.exchangeRate}
                  className="outline-none focus:border-b-2 border-grey-400 rounded-none px-0 pr-10 text-right w-[120px] disabled:bg-white"
                  disabled={currencyUnit === "KRW"}
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2">
                  KRW
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
                {dateformatter(new Date(detailData?.createdAt || ""))}
              </span>
            </div>
            <div
              className={clsx(
                openCalendar ? "h-[330px]" : "h-0",
                "duration-300 overflow-hidden flex justify-center"
              )}
            >
              <Calendar
                date={new Date(detailData?.createdAt || "")}
                onChange={(date) =>
                  setNewIncomeData((p) => ({ ...p, createdAt: date }))
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
    amount: detailData?.amount.toString() as string,
  });
  const { id: currencyUnit } = (detailData?.Budget as BudgetQueryData).Currency;

  const [updateExpense] = useMutation(UPDATE_EXPENSE, {
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
          amount: parseFloat(newExpenseData.amount as string),
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
            <Input
              type="number"
              value={newExpenseData.amount}
              onChange={(e) => {
                setNewExpenseData((p) => ({
                  ...p,
                  amount: e.target.value.replace(/(^0+)/, ""),
                }));
              }}
              autoFocus
              placeholder={`0`}
              className="text-2xl font-medium outline-none focus:border-b-2 border-red rounded-none w-full px-0 pr-10 text-right"
              onKeyDown={(e) => {
                if (e.key === "e") e.preventDefault();
              }}
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2">
              {currencyUnit}
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
                {dateformatter(new Date(newExpenseData.createdAt))}
              </span>
            </div>
            <div
              className={clsx(
                openCalendar ? "h-[330px]" : "h-0",
                "duration-300 overflow-hidden flex justify-center"
              )}
            >
              <Calendar
                date={new Date(newExpenseData.createdAt)}
                onChange={(date) =>
                  setNewExpenseData((p) => ({ ...p, createdAt: date }))
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
