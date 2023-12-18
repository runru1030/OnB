"use client";
import { useAtomValue } from "jotai";
import {
  expensesAtom,
  incomesAtom,
  tripExpenseStore,
} from "./TripDetailProvider";
const PageContent = () => {
  const expenses = useAtomValue(expensesAtom, { store: tripExpenseStore });
  const incomes = useAtomValue(incomesAtom, { store: tripExpenseStore });
  console.log(expenses, incomes);

  return <div className="main-content flex flex-col"></div>;
};

export default PageContent;
