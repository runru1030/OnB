import { Country } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
interface CountryFlagProps {
  country: Country;
  size?: number;
  roundSize?: "sm" | "md" | "lg";
  className?: string;
}
const CountryFlag = ({
  country,
  size = 48,
  roundSize = "md",
  className,
}: CountryFlagProps) => {
  return (
    <div
      className={clsx(
        `flex h-[${size}px] w-[${size}px] min-w-[${size}px] items-center justify-center bg-grey-0 rounded-full`,
        className
      )}
    >
      <Image
        src={country?.flag_img || ""}
        width={size - 12}
        height={10}
        alt="국기"
        className={`rounded-${roundSize} shadow-normal`}
      />
    </div>
  );
};

export default CountryFlag;
