"use client";
import { useMutation } from "@apollo/client";
import { income, trip } from "@app/lib/graphql/queries";
import { dateformatter } from "@app/utils";
import { getExchangeData } from "@app/utils/currency";
import Button from "@components/Button";
import { Input } from "@components/Input";
import StepModal from "@components/Modal/StepModal";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import { useParams, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import { BudgetQueryData } from "../_types";
import BudgetBox from "./BudgetBox";
import { tripAtom, tripStore } from "./TripProvider";

const budgetAtom = atomWithReset({
  id: "",
  Currency: { id: "", name: "", amountUnit: 1 },
  title: "",
  currencyId: "",
  type: "CASH",
});
const incomeReqAtom = atomWithReset({
  title: "",
  amount: "",
  exchangeRate: "1",
  date: new Date(),
});
const modalOpenAtom = atom<boolean>(false);

const CreateIncomeModal = ({
  withoutTrigger = false,
}: {
  withoutTrigger?: boolean;
}) => {
  const router = useRouter();

  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const budgetData = useAtomValue(budgetAtom);
  const incomeData = useAtomValue(incomeReqAtom);
  const resetBudgetData = useResetAtom(budgetAtom);
  const resetIncomeData = useResetAtom(incomeReqAtom);

  const { tid } = useParams();
  const [createIncome] = useMutation(income.CREATE_INCOME, {
    onCompleted: () => {
      router.refresh();
    },
    refetchQueries: [trip.GET_TRIP],
  });

  const onCreateIncome = () => {
    try {
      if (parseFloat(incomeData.amount) === 0)
        throw new Error("금액을 입력해주세요!");
      if (parseFloat(incomeData.exchangeRate) === 0)
        throw new Error("환율을 입력해주세요!");
      createIncome({
        variables: {
          ...incomeData,
          amount: parseFloat(incomeData.amount),
          exchangeRate: parseFloat(incomeData.exchangeRate),
          date: incomeData.date,
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
          <Button className="btn-grey-border bg-white w-full shadow-normal">
            예산 채우기
          </Button>
        </StepModal.Trigger>
      )}
      <StepModal.Content
        onCloseAutoFocus={() => {
          resetBudgetData();
          resetIncomeData();
        }}
      >
        <StepModal.Title withoutBackbutton>예산 채우기</StepModal.Title>
        <StepModal.StepSection
          stepContentList={[
            {
              content: <SelectBudgetContent />,
              toNext: budgetData.id !== "",
            },
            {
              content: <IcomeInputContent />,
              nextButton: (
                <StepModal.StepNext onNextStepHandler={onCreateIncome}>
                  예산 채우기
                </StepModal.StepNext>
              ),
            },
          ]}
        />
      </StepModal.Content>
    </StepModal>
  );
};
const SelectBudgetContent = () => {
  const { budgets } = useAtomValue(tripAtom, { store: tripStore });
  const setBudgetData = useSetAtom(budgetAtom);

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-4">
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

const IcomeInputContent = () => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [incomeData, setIcomeData] = useAtom(incomeReqAtom);
  const budgetData = useAtomValue(budgetAtom);
  const {
    Currency: { id: currencyUnit, amountUnit, name: currencyName },
  } = budgetData;
  const [exchageData, setExchageData] = useState({
    cur_unit: "",
    cur_nm: "",
    deal_bas_r: 0,
  });
  useEffect(() => {
    if (!currencyUnit) return;
    getExchangeData(currencyUnit).then((data) => {
      if (data) {
        setIcomeData((p) => ({
          ...p,
          exchangeRate: `${data.deal_bas_r}` ?? "0",
        }));
        setExchageData(data);
      }
    });
  }, [currencyUnit]);

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <span>{budgetData.title}</span>
          <span>{currencyUnit} </span>
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
          <div className="flex flex-col gap-4 flex-1">
            <div className="relative h-10">
              {
                <Input
                  type="number"
                  value={incomeData.amount}
                  onChange={(e) => {
                    setIcomeData((p) => ({
                      ...p,
                      amount: e.target.value.replace(/(^0+)/, ""),
                    }));
                  }}
                  autoFocus
                  placeholder={`0`}
                  className={clsx(
                    "text-2xl font-medium outline-none focus:border-b-2 border-grey-400 rounded-none w-full px-0 text-right"
                  )}
                  style={{
                    paddingRight: `${
                      (currencyName.split(" ").at(-1)?.length || 0) * 14 + 4
                    }px`,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "e") e.preventDefault();
                  }}
                />
              }
              <span className="absolute right-0 top-1/2 -translate-y-1/2">
                {currencyName.split(" ").at(-1)}
              </span>
            </div>
            <span className="flex items-center justify-end gap-1 text-grey-400">
              {Math.ceil(
                ((parseInt(incomeData.amount) || 0) *
                  (parseFloat(incomeData.exchangeRate) || 0)) /
                  amountUnit
              ).toLocaleString()}{" "}
              <span className="text-sm"> 원</span>
            </span>
            <div className="flex items-center gap-2 text-grey-400">
              <span className="flex-1 text-right">{`${amountUnit} ${currencyName
                .split(" ")
                .at(-1)}`}</span>
              <span className="text-lg">=</span>
              <div className="relative h-[26px]">
                <Input
                  type="number"
                  value={incomeData.exchangeRate}
                  onChange={(e) => {
                    setIcomeData((p) => ({
                      ...p,
                      exchangeRate: e.target.value.replace(/(^0+)/, ""),
                    }));
                  }}
                  placeholder={`${exchageData.deal_bas_r}`}
                  className="outline-none focus:border-b-2 border-grey-400 rounded-none !p-0 !pr-4 text-right w-[60px] disabled:bg-white"
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
              value={incomeData.title}
              onChange={(e) =>
                setIcomeData((p) => ({ ...p, title: e.target.value }))
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
                {dateformatter(new Date(incomeData.date))}
              </span>
            </div>
            <div
              className={clsx(
                openCalendar ? "h-[300px]" : "h-0",
                "duration-300 overflow-hidden flex justify-center"
              )}
            >
              <Calendar
                date={incomeData.date}
                onChange={(date) =>
                  setIcomeData((p) => ({ ...p, date: date }))
                }
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
CreateIncomeModal.Trigger = Trigger;
export default CreateIncomeModal;
