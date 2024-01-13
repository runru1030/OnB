"use server";
import currencySymbol from "@app/(routing)/trip/[tid]/_constants/currencySymbol";
import client from "./client";

export async function detectText(img: string, currencyId: string) {
  const request = {
    image: { content: img.split("base64,")[1] },
  };
  const [result] = await client.textDetection(request);
  const annotations = result.textAnnotations;
  const dateRegex = new RegExp(
    /^\d{4}.(0[1-9]|1[012]).(0[1-9]|[12][0-9]|3[01])$/
  );
  const resultArr = [] as {
    date: string;
    amount: number;
    title: string;
    type: string;
  }[];
  let date = "";
  let triggered = false;
  let title = "";
  let idx = 0;
  let prevText = "";
  annotations?.[0].description?.split("\n").forEach((annotation) => {
    const text = annotation?.trim();
    console.log(text);

    const isAmountTarget =
      (text.includes("-") || text.includes("+")) &&
      text.split(currencySymbol[currencyId]).length === 2;
    const isAmountTargetZero =
      text.split(currencySymbol[currencyId])?.[1]?.trim() === "0" &&
      prevText.includes(currencySymbol[currencyId]) &&
      !(prevText.includes("-") || prevText.includes("+"));

    if (dateRegex.test(text)) {
      date = text.replaceAll(".", "-");
      triggered = true;
    } else {
      if ((isAmountTarget || isAmountTargetZero) && idx < resultArr.length) {
        resultArr[idx].amount = parseFloat(
          text.split(currencySymbol[currencyId])[1].replaceAll(",", "")
        );
        idx += 1;
        triggered = false;
      }
      if (triggered) {
        if (["충전", "결제", "친구간 송금"].includes(text)) {
          resultArr.push({ date, title, type: text, amount: 0 });
        } else {
          title = text;
        }
      }
    }
    prevText = text;
  });
  return resultArr;
}
