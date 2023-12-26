"use client";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { currency, trip, budget } from "@app/lib/graphql/queries";
import Button from "@components/Button";
import CountryFlag from "@components/CountryFlag";
import { Input } from "@components/Input";
import StepModal from "@components/Modal/StepModal";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { debounce } from "@mui/material";
import { Country, Currency } from "@prisma/client";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, Suspense, useCallback, useState } from "react";
import currencyCountry from "../_constants/currencyCountry";
import { CurrencyQueryData } from "../_types";
import { tripAtom, tripStore } from "./TripProvider";

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

  const [createBudget] = useMutation(budget.CREATE_BUDGET, {
    onCompleted: () => {
      router.refresh();
    },
    refetchQueries: [trip.GET_TRIP],
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
  const { data: currenciesQueryData } = useQuery(currency.GET_CURRENCIES, {
    onCompleted: ({ currencies }) => {
      const defaultCurrency = currencies?.find(
        (curr: CurrencyQueryData) => curr.id === Country.currencyId
      );
      const newCurrencies = [...currencies];
      newCurrencies.unshift(defaultCurrency);
      setCurrencies(newCurrencies);
    },
  });
  const [currencies, setCurrencies] = useState<CurrencyQueryData[]>([]);
  const [budgetData, setBudgetData] = useAtom(budgetReqAtom);
  const { Country } = useAtomValue(tripAtom, { store: tripStore });

  const [searchData, setSearchData] = useState("");
  const [searchedCurrencies, setSearchedCurrencies] = useState<
    CurrencyQueryData[]
  >([]);
  const onSearchCurrency = useCallback(
    debounce((s) => {
      setSearchedCurrencies(
        currenciesQueryData?.currencies.filter(
          (curr: CurrencyQueryData) =>
            curr.id.includes(s) || curr.name.includes(s)
        )
      );
    }, 1000),
    [currencies]
  );

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">
          화페 단위를 선택해주세요{" "}
          <span className="text-xs font-normal text-grey-400">단일 선택</span>
        </h2>
        <div className="flex w-full relative">
          <SearchSharpIcon className="absolute top-1/2 -translate-y-1/2 left-2 text-lg text-grey-400" />
          <Input
            type="text"
            placeholder="통화명 또는 통화 코드"
            value={searchData}
            onChange={(e) => {
              setSearchData(e.target.value);
              onSearchCurrency(e.target.value);
            }}
            className="w-full bg-grey-light-300 !pl-8"
          />
        </div>
        <div
          className={clsx(
            "flex flex-wrap gap-3 justify-between",
            searchData === "" ? "visible" : "hidden"
          )}
        >
          {currencies.map((currency, idx: number) => (
            <CurrencyBox
              key={currency.id + idx}
              currency={currency}
              country={
                currency?.countries?.find(
                  (c) => c.id === currencyCountry[currency.id]
                ) as Country
              }
              className={
                budgetData.currencyId === currency.id
                  ? "text-blue !border-blue border-2"
                  : ""
              }
              onClick={() => {
                setBudgetData((p) => ({
                  ...p,
                  currencyId:
                    budgetData.currencyId === currency.id ? "" : currency.id,
                }));
              }}
            />
          ))}
        </div>{" "}
        <div
          className={clsx(
            "flex flex-wrap gap-3 justify-between",
            searchData !== "" ? "visible" : "hidden"
          )}
        >
          {searchedCurrencies.map((currency, idx: number) => (
            <CurrencyBox
              key={currency.id + idx}
              currency={currency}
              country={
                currency.countries?.find(
                  (c) => c.id === currencyCountry[currency.id]
                ) as Country
              }
              className={
                budgetData.currencyId === currency.id
                  ? "text-blue !border-blue border-2"
                  : ""
              }
              onClick={() => {
                setBudgetData((p) => ({
                  ...p,
                  currencyId:
                    budgetData.currencyId === currency.id ? "" : currency.id,
                }));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
interface CurrencyBoxProps {
  country: Country;
  currency: Currency;
}
const CurrencyBox = ({
  country,
  currency,
  ...props
}: React.ComponentProps<"div"> & CurrencyBoxProps) => {
  return (
    <div
      {...props}
      className={clsx(
        "flex flex-col gap-1 rounded-2xl border p-4 border-grey-50 justify-center items-center w-[170px] max-w-[48%] duration-300",
        props.className
      )}
    >
      <CountryFlag country={country} />
      <span className="font-medium">{country?.name}</span>
      <span className="font-medium">{currency?.id}</span>
    </div>
  );
};
