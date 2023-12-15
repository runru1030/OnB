"use client";
import Button from "@components/Button";
import { Dialog, DialogProps } from "@components/Dialog";
import Modal from "@components/Modal";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import clsx from "clsx";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { PropsWithChildren, createElement, useState } from "react";

const stepAtom = atomWithReset(1);
const openAtom = atom(false);

const StepModal = ({
  children,
  onOpenChange,
  ...props
}: PropsWithChildren<Omit<DialogProps, "open">>) => {
  const [open, setOpen] = useAtom(openAtom);

  return (
    <Modal
      {...props}
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        onOpenChange?.(open);
      }}
    >
      {children}
    </Modal>
  );
};
const StepModalContent = ({
  children,
  onCloseAutoFocus,
  className,
  ...props
}: PropsWithChildren<Dialog.DialogContentProps>) => {
  const setStep = useSetAtom(stepAtom);
  return (
    <Modal.Content
      {...props}
      className={clsx(
        "w-full top-[52px] bottom-0 translate-y-0 !p-0 rounded-b-none",
        className
      )}
      onCloseAutoFocus={(e) => {
        setStep(1);
        onCloseAutoFocus?.(e);
      }}
    >
      {children}
    </Modal.Content>
  );
};

const StepModalStepSection = ({
  stepContentList,
}: PropsWithChildren<{
  stepContentList: {
    content: React.ReactElement;
    nextButton: React.ReactElement;
  }[];
}>) => {
  const step = useAtomValue(stepAtom);
  return (
    <>
      {stepContentList.map((stepContent, idx) =>
        createElement(
          "div",
          {
            className: clsx(
              idx + 1 === step ? "visible" : "hidden",
              "flex flex-col gap-4 h-[calc(100%-60px)]"
            ),
            key: idx,
          },
          <>
            {stepContent.content}
            {stepContent.nextButton}
          </>
        )
      )}
    </>
  );
};
const StepModalTitle = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) => {
  const [step, setStep] = useAtom(stepAtom);
  return (
    <Modal.Title className={clsx("p-4", className)}>
      {step > 1 && (
        <Button
          className="absolute top-1/2 left-4 !p-0 -translate-y-1/2"
          onClick={() => setStep((p) => p - 1)}
        >
          <ArrowBackIosNewSharpIcon sx={{ fontSize: 18 }} />
        </Button>
      )}
      {children}
      <Modal.Close>
        <Button className="absolute top-1/2 right-4 !p-0 -translate-y-1/2">
          <CloseSharpIcon />
        </Button>
      </Modal.Close>
    </Modal.Title>
  );
};
const StepModalNextButton = ({
  children,
  requiredCondition,
  onNextStepHandler,
  onLastStepHandler,
}: PropsWithChildren<{
  className?: string;
  requiredCondition?: { condition: boolean; description: string };
  onNextStepHandler?: Function;
  onLastStepHandler?: Function;
}>) => {
  const setStep = useSetAtom(stepAtom);
  const setOpen = useSetAtom(openAtom);
  return (
    <Button
      onClick={() => {
        if (requiredCondition?.condition) {
          return alert(requiredCondition.description);
        }
        setStep((p) => p + 1);
        onNextStepHandler?.();
        if (onLastStepHandler) {
          onLastStepHandler();
          setOpen(false);
        }
      }}
      className="btn-blue m-4"
    >
      {children}
    </Button>
  );
};
StepModal.Title = StepModalTitle;
StepModal.Content = StepModalContent;
StepModal.StepSection = StepModalStepSection;
StepModal.StepNext = StepModalNextButton;
StepModal.Trigger = Modal.Trigger;
export default StepModal;
