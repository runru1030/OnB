import React from "react";
import { Input } from ".";

const NumericInput = ({ ...props }: React.ComponentProps<typeof Input>) => {
  return (
    <Input
      {...props}
      inputMode="numeric"
      onChange={(e) => {
        e.target.value = e.target.value
          .replaceAll(/[^0-9.]/g, "")
          .replace(
            /(\..*)$|(\d)(?=(\d{3})+(?!\d))/g,
            (digit, fract) => fract || digit + ","
          );
        props.onChange?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "e") e.preventDefault();
        if (e.currentTarget.value.includes(".") && e.key === ".")
          e.preventDefault();
        props.onKeyDown?.(e);
      }}
    />
  );
};

NumericInput.displayName = "NumericInput";
export { NumericInput };
