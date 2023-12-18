"use client";
import { useAtomValue } from "jotai";
import { expensesAtom, tripExpenseStore } from "./TripExpenseProvider";
const PageContent = () => {
  const expenses = useAtomValue(expensesAtom, { store: tripExpenseStore });
  console.log(expenses);

  return <div className="main-content flex flex-col"></div>;
};

export default PageContent;
