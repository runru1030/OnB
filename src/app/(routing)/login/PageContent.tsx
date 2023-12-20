"use client";
import Button from "@components/Button";
import { signIn, signOut } from "next-auth/react";

const PageContent = () => {
  return (
    <div>
      <Button onClick={() => signIn("kakao")}>카카오 로그인</Button>
      <Button onClick={() => signIn("naver")}>네이버 로그인</Button>
      <Button onClick={() => signOut()}>카카오 로그아웃</Button>
    </div>
  );
};

export default PageContent;
