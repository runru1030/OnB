"use client";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { trip, country } from "@app/lib/graphql/queries";
import Button from "@components/Button";
import CountryFlag from "@components/CountryFlag";
import { Input } from "@components/Input";
import StepModal from "@components/Modal/StepModal";
import useDateSelect from "@components/hooks/useDateSelect";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { debounce } from "@mui/material";
import { Country } from "@prisma/client";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { CONTINENT } from "../trip/[tid]/_constants";

const tripReqAtom = atomWithReset({
  title: "",
  countryId: "",
  startedAt: new Date(),
  endedAt: new Date(),
});

const CreateTripStepModal = () => {
  const router = useRouter();
  const tripData = useAtomValue(tripReqAtom);
  const resetTripData = useResetAtom(tripReqAtom);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [createTrip] = useMutation(trip.CREATE_TRIP, {
    onCompleted: () => {
      router.refresh();
    },
  });
  const onCreateTrip = () => {
    try {
      if (tripData.title.trim() === "")
        throw new Error("여행 이름을 입력해주세요!");
      if (tripData.countryId === "")
        throw new Error("여행 국가를 선택해주세요!");

      createTrip({
        variables: {
          ...tripData,
          userId,
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
        <Button className="btn-blue flex items-center justify-center gap-1">
          <AddSharpIcon sx={{ fontSize: 18 }} />
          여행 만들기
        </Button>
      </StepModal.Trigger>
      <StepModal.Content onCloseAutoFocus={resetTripData}>
        <StepModal.Title className="p-4">여행 만들기</StepModal.Title>

        <StepModal.StepSection
          stepContentList={[
            {
              content: <TitleInputContent />,
              nextButton: (
                <StepModal.StepNext
                  requiredCondition={{
                    condition: tripData.title.trim().length === 0,
                    description: "이름을 입력해주세요!",
                  }}
                >
                  다음
                </StepModal.StepNext>
              ),
            },
            {
              content: <SelectCountryContent />,
              nextButton: (
                <StepModal.StepNext
                  requiredCondition={{
                    condition: tripData.countryId === "",
                    description: "국가를 선택해주세요!",
                  }}
                >
                  다음
                </StepModal.StepNext>
              ),
            },
            {
              content: <SelectDateContent />,
              nextButton: (
                <StepModal.StepNext onNextStepHandler={onCreateTrip}>
                  여행 만들기
                </StepModal.StepNext>
              ),
            },
          ]}
        />
      </StepModal.Content>
    </StepModal>
  );
};

export default CreateTripStepModal;

const TitleInputContent = () => {
  const [tripData, setTripData] = useAtom(tripReqAtom);
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="여행 이름"
          type="text"
          value={tripData.title}
          onChange={(e) =>
            setTripData((p) => ({ ...p, title: e.target.value }))
          }
          required
          autoFocus
          maxLength={10}
          className="h-[42px] text-2xl outline-none focus:border-b-2 border-grey-400 rounded-none !px-0 w-full"
        />
        <span className="text-xs font-normal text-grey-400 text-right">
          최대 10자
        </span>
      </div>
    </div>
  );
};

interface CountryByContinent {
  [key: string]: { countries: Country[]; open: boolean };
}
interface OpenStateByContinent {
  [key: string]: boolean;
}
const SelectCountryContent = () => {
  const [openStateByContinent, setOpenStateByContinent] =
    useState<OpenStateByContinent>({});
  const [countryByContinent, setCountryByContinent] =
    useState<CountryByContinent>({});
  const { data: countriesQueryData } = useQuery(country.GET_COUNTRIES, {
    onCompleted: ({ countries }: { countries: Country[] }) => {
      const groupByData = countries.reduce(
        (acc: CountryByContinent, country) => {
          if (!acc[country.continent]) {
            acc[country.continent] = { countries: [], open: false };
          }
          acc[country.continent].countries.push(country);
          return acc;
        },
        {}
      );
      const openByContinent = Object.keys(groupByData).reduce(
        (acc: { [key: string]: boolean }, continent) => {
          acc[continent] = false;
          return acc;
        },
        {}
      );

      setCountryByContinent(groupByData);
      setOpenStateByContinent(openByContinent);
    },
  });
  const [tripData, setTripData] = useAtom(tripReqAtom);

  const [searchData, setSearchData] = useState("");
  const [searchedCountries, setSearchedCountries] = useState<Country[]>([]);
  const onSearchCountry = useCallback(
    debounce((s) => {
      setSearchedCountries(
        countriesQueryData.countries.filter(
          (c: Country) =>
            c.id.includes(s) || c.name.includes(s) || c.name_en.includes(s)
        )
      );
    }, 1000),
    [countriesQueryData]
  );

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">
          여행 국가를 선택해주세요{" "}
          <span className="text-xs font-normal text-grey-400">단일 선택</span>
        </h2>
        <div className="flex w-full relative">
          <SearchSharpIcon className="absolute top-1/2 -translate-y-1/2 left-2 text-lg text-grey-400" />
          <Input
            type="text"
            placeholder="국가명 또는 국가 코드"
            value={searchData}
            onChange={(e) => {
              setSearchData(e.target.value);
              onSearchCountry(e.target.value);
            }}
            className="w-full bg-grey-light-300 !pl-8"
          />
        </div>
        <div
          className={clsx(
            "flex flex-col gap-3",
            searchData === "" ? "visible" : "hidden"
          )}
        >
          {Object.keys(CONTINENT).map((continent) => (
            <div key={continent}>
              <div
                onClick={() => {
                  setOpenStateByContinent((p) => ({
                    ...p,
                    [continent]: !p[continent],
                  }));
                }}
                className="px-2 py-3 text-lg flex justify-between font-medium"
              >
                {CONTINENT[continent]}
                <KeyboardArrowDownSharpIcon
                  className={clsx(
                    openStateByContinent[continent] ? "rotate-0" : "rotate-180",
                    "duration-300 text-grey-300"
                  )}
                />
              </div>
              <div
                className={clsx(
                  openStateByContinent[continent] ? "visible" : "hidden",
                  "flex flex-col gap-1"
                )}
              >
                {countryByContinent[continent]?.countries.map((country) => (
                  <div
                    key={country.id}
                    onClick={() => {
                      setTripData((p) => ({
                        ...p,
                        countryId:
                          tripData.countryId === country.id ? "" : country.id,
                      }));
                    }}
                    className={clsx(
                      tripData.countryId === country.id &&
                        "text-blue font-medium",
                      "px-2 py-1 rounded-lg flex justify-between items-center duration-300"
                    )}
                  >
                    {country.name}
                    <CountryFlag
                      country={country}
                      roundSize="sm"
                      size={40}
                      className={
                        tripData.countryId === country.id
                          ? "border-2 border-blue duration-300"
                          : "border-blue duration-300"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className={clsx(
            "flex flex-col gap-3",
            searchData !== "" ? "visible" : "hidden"
          )}
        >
          {searchedCountries.map((country) => (
            <div
              key={country.id}
              onClick={() => {
                setTripData((p) => ({
                  ...p,
                  countryId:
                    tripData.countryId === country.id ? "" : country.id,
                }));
              }}
              className={clsx(
                tripData.countryId === country.id && "text-blue font-medium",
                "px-2 py-1 rounded-lg flex justify-between items-center duration-300"
              )}
            >
              {country.name}
              <CountryFlag
                country={country}
                roundSize="sm"
                size={40}
                className={
                  tripData.countryId === country.id
                    ? "border-2 border-blue duration-300"
                    : "border-blue duration-300"
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const SelectDateContent = () => {
  const [tripData, setTripData] = useAtom(tripReqAtom);
  const { selectionRange, handleSelectDate } = useDateSelect({
    defaultStartDate: tripData.startedAt,
    defaultEndDate: tripData.endedAt,
  });

  useEffect(() => {
    setTripData((p) => ({
      ...p,
      startedAt: selectionRange.startDate,
      endedAt: selectionRange.endDate,
    }));
  }, [selectionRange]);

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">여행 날짜를 선택해주세요 </h2>
        <DateRange ranges={[selectionRange]} onChange={handleSelectDate} />
      </div>
    </div>
  );
};
