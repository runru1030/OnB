import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import { Dialog, DialogProps } from "@components/Dialog";
import Button from "@components/Button";

const ModalTrigger = React.forwardRef<HTMLButtonElement, PropsWithChildren>(
  ({ children }, ref) => {
    return (
      <Dialog.Trigger asChild ref={ref}>
        {children}
      </Dialog.Trigger>
    );
  }
);
ModalTrigger.displayName = "ModalTrigger";

const ModalClose = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <Dialog.Close asChild {...{ className }}>
      {children}
    </Dialog.Close>
  );
};

const ModalTitle = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <Dialog.Title
      className={clsx("relative flex flex-col text-xl text-center", className)}
    >
      {children}
    </Dialog.Title>
  );
};

const ModalContent = ({
  children,
  className,
  withoutOverlay = false,
  ...props
}: PropsWithChildren<
  Dialog.DialogContentProps & { withoutOverlay?: boolean }
>) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={clsx(
          "fixed inset-0 opacity-20 transition-opacity z-20",
          withoutOverlay ? "bg-transparent" : "bg-grey-500 "
        )}
      />
      <Dialog.Content
        {...props}
        className={clsx(
          "fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6",
          className
        )}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};

const ModalFooter = ({
  cancelText = "취소",
  confirmText = "확인",
  onClickConfirm = () => {
    return;
  },
  onClickClose = () => {
    return;
  },
  ...props
}) => {
  return (
    <div {...props} className="flex gap-3">
      <ModalClose>
        <Button onClick={onClickClose}>{cancelText}</Button>
      </ModalClose>
      <Button onClick={onClickConfirm}>{confirmText}</Button>
    </div>
  );
};

const Modal = ({ children, ...props }: PropsWithChildren<DialogProps>) => {
  return <Dialog.Root {...props}>{children}</Dialog.Root>;
};

Modal.Close = ModalClose;
Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.Trigger = ModalTrigger;
Modal.Footer = ModalFooter;
export default Modal;
