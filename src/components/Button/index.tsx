import clsx from "clsx";
import React, { forwardRef } from "react";

type ButtonProps = React.ComponentProps<"button">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ButtonRef) => {
    return (
      <button
        {...props}
        className={clsx("py-2 px-4", className)}
        ref={ButtonRef}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
