"use client";
import { useMutation } from "@apollo/client";
import { getExchangeData } from "@app/utils/currency";
import Button from "@components/Button";
import { Input } from "@components/Input";
import StepModal from "@components/Modal/StepModal";
import { CREATE_INCOME } from "@app/lib/graphql/mutations";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BudgetBox from "./BudgetBox";
import { tripAtom, tripStore } from "./TripProvider";

const budgetAtom = atomWithReset({
  id: "",
  Currency: { id: "", name: "", countryId: "", amountUnit: 1 },
  title: "",
  currencyId: "",
  type: "CASH",
});
const incomeReqAtom = atomWithReset({
  amount: "0",
  exchangeRate: "0",
});

const CreateIncomeModal = () => {
  const router = useRouter();

  const budgetData = useAtomValue(budgetAtom);
  const incomeData = useAtomValue(incomeReqAtom);
  const resetBudgetData = useResetAtom(budgetAtom);
  const resetIncomeData = useResetAtom(incomeReqAtom);

  const { id } = useAtomValue(tripAtom, { store: tripStore });
  const [createIncome] = useMutation(CREATE_INCOME, {
    onCompleted: () => {
      router.refresh();
    },
  });

  const onCreateIncome = () => {
    try {
      if (parseInt(incomeData.amount) === 0)
        throw new Error("금액을 입력해주세요!");
      if (parseFloat(incomeData.exchangeRate) === 0)
        throw new Error("환율을 입력해주세요!");
      createIncome({
        variables: {
          amount: parseInt(incomeData.amount),
          exchangeRate: parseFloat(incomeData.exchangeRate),
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
        <Button className="btn-blue w-full">예산 채우기</Button>
      </StepModal.Trigger>
      <StepModal.Content
        onCloseAutoFocus={() => {
          resetBudgetData();
          resetIncomeData();
        }}
      >
        <StepModal.Title>예산 채우기</StepModal.Title>
        <StepModal.StepSection
          stepContentList={[
            {
              content: <SelectBudgetContent />,
              nextButton: (
                <StepModal.StepNext
                  requiredCondition={{
                    condition: !budgetData,
                    description: "채울 예산을 선택해주세요!",
                  }}
                >
                  다음
                </StepModal.StepNext>
              ),
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

export default CreateIncomeModal;

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

const IcomeInputContent = () => {
  const [incomeData, setIcomeData] = useAtom(incomeReqAtom);
  const budgetData = useAtomValue(budgetAtom);
  const {
    Currency: { id: currencyUnit, amountUnit },
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
          <div className="relative h-10">
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
              className="text-xl font-medium outline-none focus:border-b-2 border-grey-400 rounded-none w-full px-0 pr-10 text-right"
              onKeyDown={(e) => {
                if (e.key === "." || e.key === "e") e.preventDefault();
              }}
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2">
              {currencyUnit || "JPY"}
            </span>
          </div>
          <span className="flex items-center justify-end gap-2">
            {Math.ceil(
              ((parseInt(incomeData.amount) || 0) *
                (parseFloat(incomeData.exchangeRate) || 0)) /
                amountUnit
            ).toLocaleString()}{" "}
            <span className="text-sm">KRW</span>
          </span>
          <div className="flex items-center gap-2 text-grey-400">
            <span className="flex-1 text-right">{`${amountUnit} ${currencyUnit}`}</span>
            <span className="text-lg">=</span>
            <div className="relative">
              <Input
                type="number"
                value={incomeData.exchangeRate}
                onChange={(e) => {
                  setIcomeData((p) => ({
                    ...p,
                    exchangeRate: e.target.value.replace(/(^0+)/, ""),
                  }));
                }}
                autoFocus
                placeholder={`${exchageData.deal_bas_r}`}
                className="outline-none focus:border-b-2 border-grey-400 rounded-none px-0 pr-10 text-right w-[120px]"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2">
                KRW
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
