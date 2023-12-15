"use client";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import Button from "@components/Button";
import DateSelector from "@components/DateSelector";
import { Input } from "@components/Input";
import StepModal from "@components/Modal/StepModal";
import useDateSelect from "@components/useDateSelect";
import { CREATE_TRIP } from "@lib/graphql/mutations";
import { GET_COUNTRIES } from "@lib/graphql/queries";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import { Country } from "@prisma/client";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const userId = "1";
  const [createTrip] = useMutation(CREATE_TRIP, {
    onCompleted: (res) => {
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
                <StepModal.StepNext onLastStepHandler={onCreateTrip}>
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
      <div className="flex flex-col gap-4 ">
        <h2 className="text-xl font-medium">
          여행 이름을 입력해주세요{" "}
          <span className="text-xs font-normal text-grey-400">최대 10자</span>
        </h2>
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
          className="w-full text-lg border-blue-300 rounded-xl"
        />
      </div>
    </div>
  );
};
const SelectCountryContent = () => {
  const { data: countriesQuery } = useQuery(GET_COUNTRIES);
  const [tripData, setTripData] = useAtom(tripReqAtom);
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">
          여행 국가를 선택해주세요{" "}
          <span className="text-xs font-normal text-grey-400">단일 선택</span>
        </h2>
        <div className="flex flex-col gap-2 ">
          {countriesQuery?.countries?.map((country: Country) => (
            <div
              key={country.id}
              onClick={() => {
                if (tripData.countryId === country.id) {
                  setTripData((p) => ({ ...p, countryId: "" }));
                } else {
                  setTripData((p) => ({ ...p, countryId: country.id }));
                }
              }}
              className={clsx(
                tripData.countryId === country.id &&
                  "bg-grey-light-400 duration-300 text-blue",
                "p-1.5 rounded-lg flex justify-between"
              )}
            >
              {country.name}
              <Image
                src={country.flag_img ?? ""}
                width={40}
                height={100}
                alt="국기"
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
        <DateSelector ranges={[selectionRange]} onChange={handleSelectDate} />
      </div>
    </div>
  );
};
