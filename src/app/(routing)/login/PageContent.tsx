"use client";
import KAKAO from "@asets/kakao.svg";
import LOGO from "@asets/logo_lg.svg";
import NAVER from "@asets/naver.svg";
import Button from "@components/Button";
import { signIn } from "next-auth/react";

const PageContent = () => {
  return (
    <div className="flex flex-col w-full h-screen px-10 py-28">
      <div className="flex-1 flex flex-col items-center pt-20 gap-10">
        <LOGO />
        <div className="flex flex-col gap-1 items-end">
          <span className="font-light">on a budget :</span>
          <span className="text-xs font-light">한정된 예산으로 알뜰하게</span>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={() => signIn("kakao")}>
          <KAKAO />
        </Button>
        <Button onClick={() => signIn("naver")}>
          <NAVER />
        </Button>
      </div>
    </div>
  );
};

export default PageContent;
