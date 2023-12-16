import Button from "@components/Button";
import { Dialog } from "@components/Dialog";
import Modal from "@components/Modal";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import { PropsWithChildren } from "react";

const elementDataAtom = atomWithReset<any>({});
export const useElementModal = () => {
  const [elementData, setElementData] = useAtom(elementDataAtom);
  const [open, setOpen] = useAtom(modalOpenAtom);
  return { elementData, setElementData, open, setOpen };
};

const modalOpenAtom = atom<boolean>(false);
const buttonPosAtom = atom({ right: 0, bottom: 0, width: 0, height: 0 });
const ElementModal = ({
  children,
  className,
  ...props
}: PropsWithChildren<Dialog.DialogContentProps>) => {
  const [openAtom, setOpenAtom] = useAtom(modalOpenAtom);
  const resetElementData = useResetAtom(elementDataAtom);
  const buttonPos = useAtomValue(buttonPosAtom);

  return (
    <Modal open={openAtom} onOpenChange={setOpenAtom}>
      <Modal.Content
        {...props}
        className={clsx(
          `!p-0 rounded-xl -translate-x-full w-max shadow-normal`,
          className
        )}
        style={{
          top: buttonPos.bottom,
          left: buttonPos.right,
        }}
        withoutOverlay
        onCloseAutoFocus={resetElementData}
      >
        {children}
      </Modal.Content>
    </Modal>
  );
};
const ElementModalTrigger = ({
  children,
  onClick,
  ...props
}: PropsWithChildren<React.ComponentProps<typeof Button>>) => {
  const setButtonPos = useSetAtom(buttonPosAtom);
  const setOpenAtom = useSetAtom(modalOpenAtom);
  return (
    <Button
      onClick={(e) => {
        setButtonPos(e.currentTarget.getBoundingClientRect());
        setOpenAtom(true);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
ElementModal.Trigger = ElementModalTrigger;
export default ElementModal;
