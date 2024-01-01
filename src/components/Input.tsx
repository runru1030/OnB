import { onFocusSetCursorPosition } from "@app/utils";
import clsx from "clsx";
import React, { forwardRef } from "react";

type InputProps = React.ComponentProps<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, inputRef) => {
    return (
      <input
        {...props}
        className={clsx(
          "rounded-md py-1 px-2 duration-300 placeholder:text-light-grey-400",
          className
        )}
        ref={inputRef}
        onFocus={onFocusSetCursorPosition}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
