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
  const convertObj = { expenses: [], incomes: [] } as {
    [key: string]: { date: string; value: number }[];
  };
  let activeFlag = -1;
  let activeType = "expenses";
  let expenseIdx = 0;
  let incomeIdx = 0;
  let date = "";
  annotations?.forEach((annotation) => {
    if (!annotation.description) return;
    const text = annotation.description?.trim();
    if (dateRegex.test(text)) date = text;

    if (text === "충전") {
      convertObj.incomes.push({ date, value: 0 });
    }
    if (text === "결제") {
      convertObj.expenses.push({ date, value: 0 });
    }
    if (["+", "-"].includes(text)) {
      if (text === "+") {
        activeFlag += 1;
        activeType = "incomes";
      }
      if (text === "-") {
        activeFlag += 1;
        activeType = "expenses";
      }
    } else if (activeFlag === 0) {
      if (text === currencySymbol[currencyId]) {
        activeFlag += 1;
      } else activeFlag = -1;
    } else if (activeFlag === 1) {
      convertObj[activeType][
        activeType === "expenses" ? expenseIdx : incomeIdx
      ].value = parseFloat(text.replaceAll(",", ""));
      if (activeType === "expenses") expenseIdx += 1;
      if (activeType === "incomes") incomeIdx += 1;
      activeFlag = -1;
    }
  });
  return convertObj;
}
