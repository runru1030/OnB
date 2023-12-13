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
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { Country } from "@prisma/client";
import clsx from "clsx";
import { useSetAtom } from "jotai";
import { FormEvent, useState } from "react";
import { myTripsAtom } from "../HomeProvider";

const CreateTripModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: countriesQuery } = useQuery(GET_COUNTRIES);
  const userId = "1";

  const [tripData, setTripData] = useState({
    title: "",
    countryId: "",
  });
  const { selectionRange, handleSelectDate, resetSelectDate } = useDateSelect();

  const [createTrip] = useMutation(CREATE_TRIP, {
    onCompleted: (res) => {
      setMyTrips((p) => [res.createTrip, ...p]);
      setIsOpen(false);
    },
  });
  const setMyTrips = useSetAtom(myTripsAtom);

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
          startedAt: selectionRange.startDate,
          endedAt: selectionRange.startDate,
          userId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setTripData({
            title: "",
            countryId: "",
          });
          resetSelectDate();
        }
      }}
    >
      <Modal.Trigger>
        <Button className="fixed bottom-10 left-1/2 -translate-x-1/2">
          여행 추가
        </Button>
      </Modal.Trigger>
      <Modal.Content className="w-full top-[52px] bottom-0 translate-y-0 px-0">
        <Modal.Title>
          나의 여행 만들기
          <Modal.Close>
            <Button className="absolute top-0 left-4 !p-0">
              <CloseSharpIcon />
            </Button>
          </Modal.Close>
        </Modal.Title>

        <form
          onSubmit={onCreateTrip}
          className="flex flex-col gap-4 py-5 h-full overflow-y-auto px-4"
        >
          <Input
            placeholder="여행 이름을 입력해주세요"
            type="text"
            value={tripData.title}
            onChange={(e) =>
              setTripData((p) => ({ ...p, title: e.target.value }))
            }
            required
            className="w-full text-lg font-medium border border-blue-300 rounded-lg"
          />

          <div className="flex flex-col gap-2">
            <h2 className=" font-medium text-lg">여행 국가</h2>
            <div className="h-[30vh] overflow-scroll flex flex-col gap-2 ">
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
                    "p-1.5 rounded-md"
                  )}
                >
                  {country.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className=" font-medium text-lg">여행 날짜</h2>
            <DateSelector
              ranges={[selectionRange]}
              onChange={handleSelectDate}
            />
          </div>

          <Button type="submit" className="btn-blue">
            여행 만들기
          </Button>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default CreateTripModal;
