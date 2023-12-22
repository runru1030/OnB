"use client";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import Button from "@components/Button";
import { Input } from "@components/Input";
import StepModal from "@components/Modal/StepModal";
import { CREATE_BUDGET } from "@app/lib/graphql/mutations";
import { GET_CURRENCIES } from "@app/lib/graphql/queries";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import { Currency } from "@prisma/client";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, Suspense, useMemo } from "react";
import { tripAtom, tripStore } from "./TripProvider";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
interface budgetReqAtom {
  title: string;
  currencyId: string;
  type: "CARD" | "CASH";
}
const budgetReqAtom = atomWithReset<budgetReqAtom>({
  title: "",
  currencyId: "",
  type: "CASH",
});

const CreateBudgetModal = () => {
  const router = useRouter();
  const { tid } = useParams();

  const budgetData = useAtomValue(budgetReqAtom);
  const resetTripData = useResetAtom(budgetReqAtom);
  
  const [createBudget] = useMutation(CREATE_BUDGET, {
    onCompleted: () => {
      router.refresh();
    },
  });

  const onCreateBudget = () => {
    try {
      if (budgetData.title.trim() === "")
        throw new Error("여행 이름을 입력해주세요!");
      if (budgetData.currencyId === "")
        throw new Error("여행 국가를 선택해주세요!");

      createBudget({
        variables: {
          ...budgetData,
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
    <StepModal>
      <StepModal.Trigger>
        <Button className="btn-grey-border border-dashed flex items-center justify-center gap-1">
          <AddSharpIcon sx={{ fontSize: 18 }} />
          예산 만들기
        </Button>
      </StepModal.Trigger>
      <StepModal.Content onCloseAutoFocus={resetTripData}>
        <StepModal.Title>예산 만들기</StepModal.Title>
        <StepModal.StepSection
          stepContentList={[
            {
              content: <TitleInputContent />,
              nextButton: (
                <StepModal.StepNext
                  requiredCondition={{
                    condition: budgetData.title.trim().length === 0,
                    description: "이름을 입력해주세요!",
                  }}
                >
                  다음
                </StepModal.StepNext>
              ),
            },
            {
              content: (
                <Suspense fallback={"로딩"}>
                  <SelectCurrencyContent />
                </Suspense>
              ),
              nextButton: (
                <StepModal.StepNext onNextStepHandler={onCreateBudget}>
                  예산 만들기
                </StepModal.StepNext>
              ),
            },
          ]}
        />
      </StepModal.Content>
    </StepModal>
  );
};

export default CreateBudgetModal;

const TitleInputContent = () => {
  const [budgetData, setBudgetData] = useAtom(budgetReqAtom);

  const onChangeValueHandler = (
    e: ChangeEvent | React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    const { value, name } = e.target as HTMLInputElement | HTMLButtonElement;
    setBudgetData((p) => ({ ...p, [name]: value }));
  };
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Input
            placeholder="예산 이름"
            name="title"
            type="text"
            value={budgetData.title}
            onChange={onChangeValueHandler}
            required
            autoFocus
            maxLength={10}
            className="h-[42px] text-2xl outline-none focus:border-b-2 border-grey-400 rounded-none !px-0 w-full"
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
                budgetData.type === "CASH" ? "btn-blue-grey" : "text-grey-300",
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
                budgetData.type === "CARD" ? "btn-blue-grey" : "text-grey-300",
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
      </div>
    </div>
  );
};

const SelectCurrencyContent = () => {
  const { data: currenciesQuery } = useQuery(GET_CURRENCIES);

  const [budgetData, setBudgetData] = useAtom(budgetReqAtom);
  const { Country } = useAtomValue(tripAtom, { store: tripStore });

  const defaultCurrencies = useMemo(
    () =>
      currenciesQuery?.currencies?.filter(
        (currency: Currency) => currency.countryId === Country.id
      ) ?? [],
    [currenciesQuery, Country.id]
  );
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">
          화페 단위를 선택해주세요{" "}
          <span className="text-xs font-normal text-grey-400">단일 선택</span>
        </h2>
        <div className="flex flex-col gap-2 ">
          {defaultCurrencies
            .concat(currenciesQuery?.currencies ?? [])
            .map((currency: Currency, idx: number) => (
              <div
                key={currency.id + idx}
                onClick={() => {
                  if (budgetData.currencyId === currency.id) {
                    setBudgetData((p) => ({ ...p, currencyId: "" }));
                  } else {
                    setBudgetData((p) => ({ ...p, currencyId: currency.id }));
                  }
                }}
                className={clsx(
                  budgetData.currencyId === currency.id &&
                    "bg-grey-light-400 duration-300 text-blue",
                  "p-1.5 rounded-lg flex justify-between"
                )}
              >
                <span className="font-medium">{currency.id}</span>
                <span>{currency.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
