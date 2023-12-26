"use client";
import Button from "@components/Button";
import Modal from "@components/Modal";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { atom, useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
const modalOpenAtom = atom<boolean>(false);

const MyInfoModal = () => {
  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const { data } = useSession();
  return (
    <Modal open={openAtom} onOpenChange={setOpenAtom}>
      <Modal.Trigger>
        <Button className="!p-0 text-grey-200">
          <AccountCircleTwoToneIcon sx={{ fontSize: 28 }} />
        </Button>
      </Modal.Trigger>
      <Modal.Content className="w-full top-[52px] bottom-0 translate-y-0 !p-0 rounded-b-none">
        <Modal.Title className="p-4">
          마이
          <Modal.Close>
            <Button className="absolute top-1/2 right-4 !p-0 -translate-y-1/2">
              <CloseSharpIcon />
            </Button>
          </Modal.Close>
        </Modal.Title>
        <div className="flex flex-col gap-4 h-[calc(100%-60px)]">
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="">이름</h2>
              <div className="">{data?.user.name}</div>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="">이메일</h2>
              <div className="">{data?.user.email}</div>
            </div>
          </div>
          <Button
            className="btn-red-border text-sm m-4 mb-6"
            onClick={() => signOut()}
          >
            로그아웃
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};
export default MyInfoModal;
