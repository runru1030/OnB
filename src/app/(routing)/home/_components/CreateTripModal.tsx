"use client";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import Button from "@components/Button";
import DateSelector from "@components/DateSelector";
import { Input } from "@components/Input";
import Modal from "@components/Modal";
import useDateSelect from "@components/useDateSelect";
import { CREATE_TRIP } from "@lib/graphql/mutations";
import { GET_COUNTRIES } from "@lib/graphql/queries";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { Country } from "@prisma/client";
import clsx from "clsx";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { myTripStore, myTripsAtom } from "./MyTripProvider";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";

const tripReqAtom = atomWithReset({
  title: "",
  countryId: "",
  startedAt: new Date(),
  endedAt: new Date(),
});
const stepAtom = atomWithReset(1);

const CreateTripModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useAtom(stepAtom);

  const tripData = useAtomValue(tripReqAtom);
  const resetTripData = useResetAtom(tripReqAtom);
  const userId = "1";
  const setMyTrips = useSetAtom(myTripsAtom, { store: myTripStore });

  const [createTrip] = useMutation(CREATE_TRIP, {
    onCompleted: (res) => {
      setMyTrips((p) => [res.createTrip, ...p]);
      setIsOpen(false);
    },
  });

  const onCreateTrip = (e: FormEvent) => {
    try {
      e.preventDefault();
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
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetTripData();
          setStep(1);
        }
      }}
    >
      <Modal.Trigger>
        <Button className="btn-blue flex items-center justify-center gap-1">
          <AddSharpIcon sx={{ fontSize: 18 }} />
          여행 만들기
        </Button>
      </Modal.Trigger>
      <Modal.Content className="w-full top-[52px] bottom-0 translate-y-0 !p-0 rounded-b-none">
        <Modal.Title className="p-4">
          {step > 1 && (
            <Button
              className="absolute top-1/2 left-4 !p-0 -translate-y-1/2"
              onClick={() => setStep((p) => p - 1)}
            >
              <ArrowBackIosNewSharpIcon sx={{ fontSize: 18 }} />
            </Button>
          )}
          여행 만들기
          <Modal.Close>
            <Button className="absolute top-1/2 right-4 !p-0 -translate-y-1/2">
              <CloseSharpIcon />
            </Button>
          </Modal.Close>
        </Modal.Title>

        <div className="flex flex-col gap-4 h-[calc(100%-60px)]">
          {
            {
              1: <TitleInputContent />,
              2: <SelectCountryContent />,
              3: <SelectDateContent onCreateTrip={onCreateTrip} />,
            }[step]
          }
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default CreateTripModal;

const TitleInputContent = () => {
  const [tripData, setTripData] = useAtom(tripReqAtom);
  const setStep = useSetAtom(stepAtom);
  return (
    <>
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
      <Button
        onClick={() => {
          if (tripData.title.trim().length == 0) {
            return alert("이름을 입력해주세요!");
          }
          setStep((p) => p + 1);
        }}
        className="btn-blue m-4"
      >
        다음
      </Button>
    </>
  );
};
const SelectCountryContent = () => {
  const { data: countriesQuery } = useQuery(GET_COUNTRIES);
  const [tripData, setTripData] = useAtom(tripReqAtom);
  const setStep = useSetAtom(stepAtom);
  return (
    <>
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
      <Button
        onClick={() => {
          if (tripData.countryId === "") {
            return alert("국가를 선택해주세요!");
          }
          setStep((p) => p + 1);
        }}
        className="btn-blue m-4"
      >
        다음
      </Button>
    </>
  );
};
interface SelectDateContentProps {
  onCreateTrip: (e: FormEvent) => void;
}
const SelectDateContent = ({ onCreateTrip }: SelectDateContentProps) => {
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
    <>
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium">여행 날짜를 선택해주세요 </h2>
          <DateSelector ranges={[selectionRange]} onChange={handleSelectDate} />
        </div>
      </div>
      <Button onClick={onCreateTrip} className="btn-blue m-4">
        여행 만들기
      </Button>
    </>
  );
};
