"use client";
import Button from "@components/Button";
import { Dialog, DialogProps } from "@components/Dialog";
import Modal from "@components/Modal";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import clsx from "clsx";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithReset } from "jotai/utils";
import React, { PropsWithChildren, createElement } from "react";

const stepAtom = atomWithReset(1);

const StepModal = ({
  children,
  onOpenChange,
  ...props
}: PropsWithChildren<Omit<DialogProps, "open">>) => {
  return <Modal {...props}>{children}</Modal>;
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
            {idx + 1 === stepContentList.length ? (
              <Modal.Close>{stepContent.nextButton}</Modal.Close>
            ) : (
              stepContent.nextButton
            )}
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
  ...props
}: PropsWithChildren<
  React.ComponentProps<typeof Button> & {
    requiredCondition?: { condition: boolean; description: string };
    onNextStepHandler?: Function;
  }
>) => {
  const setStep = useSetAtom(stepAtom);
  return (
    <Button
      {...props}
      onClick={(e) => {
        if (requiredCondition?.condition) {
          return alert(requiredCondition.description);
        }
        setStep((p) => p + 1);
        onNextStepHandler?.(e);
        props.onClick?.(e);
      }}
      className={clsx("btn-blue m-4", props.className)}
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
