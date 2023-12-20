"use client";
import { useAtomValue } from "jotai";
import IncomeExpenseList from "../../_components/IncomeExpenseList";
import {
  expensesAtom,
  incomesAtom,
  tripExpenseStore,
} from "./TripDetailProvider";
const PageContent = () => {
  const expenses = useAtomValue(expensesAtom, { store: tripExpenseStore });
  const incomes = useAtomValue(incomesAtom, { store: tripExpenseStore });

  return (
    <div className="main-content flex flex-col px-0 gap-2">
      <IncomeExpenseList dataList={[...expenses, ...incomes]} />
    </div>
  );
};

export default PageContent;
