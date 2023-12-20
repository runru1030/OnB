"use client"
import { useMutation } from "@apollo/client";
import Button from "@components/Button";
import Modal from "@components/Modal";
import { DELETE_TRIP } from "@lib/graphql/mutations";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { atom, useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { tripAtom, tripStore } from "./TripProvider";
import Image from "next/image";
import { dateformatter } from "@app/utils";

const modalOpenAtom = atom<boolean>(false);

const TripInfoModal = () => {
  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const trip = useAtomValue(tripAtom, { store: tripStore });

  const router = useRouter();
  const [deleteBudget] = useMutation(DELETE_TRIP, {
    variables: { id: trip?.id },
    onCompleted: () => {
      router.push("/home");
      router.refresh();
    },
  });

  return (
    <Modal open={openAtom} onOpenChange={setOpenAtom}>
      <Modal.Trigger>
        <Button className="!p-0">{trip.title}</Button>
      </Modal.Trigger>
      <Modal.Content className="w-full top-[52px] bottom-0 translate-y-0 !p-0 rounded-b-none">
        <Modal.Title className="p-4">
          {trip.title}
          <Modal.Close>
            <Button className="absolute top-1/2 right-4 !p-0 -translate-y-1/2">
              <CloseSharpIcon />
            </Button>
          </Modal.Close>
        </Modal.Title>
        <div className="flex flex-col gap-4 h-[calc(100%-60px)]">
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-center">
              <Image
                src={trip.Country.flag_img ?? ""}
                width={50}
                height={10}
                alt="국기"
              />
              <span className="text-xs text-grey-500">{trip.Country.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="">여행 시작일</h2>
              <div className="tracking-wide">
                {dateformatter(new Date(trip.startedAt))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="">여행 종료일</h2>
              <div className="tracking-wide">
                {dateformatter(new Date(trip.endedAt))}
              </div>
            </div>
          </div>
          <Button
            className="btn-red text-sm m-4"
            onClick={() => {
              deleteBudget({ variables: { id: trip?.id } });
            }}
          >
            여행 삭제하기
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};
export default TripInfoModal;
