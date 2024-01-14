import Button from "@components/Button";
import Modal from "@components/Modal";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
import PaymentsTwoToneIcon from "@mui/icons-material/PaymentsTwoTone";
import clsx from "clsx";
import ko from "date-fns/locale/ko";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { PropsWithChildren, useMemo, useState } from "react";
import { DateRange } from "react-date-range";
import CategoryTag from "../../_components/CategoryTag";
import { EXPNSE_CATEGORY } from "../../_constants";
import { ExpenseQueryData, IncomeQueryData } from "../_types";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import { atomWithReset, useResetAtom } from "jotai/utils";

type filterType = "date" | "category" | "budgetType";
const filterTypeAtom = atom<filterType | "">("");

const selectionDateAtom = atomWithReset({
  startDate: new Date(),
  endDate: new Date(),
  ALL: true,
  key: "selection",
});
const selectionCategoriesAtom = atomWithReset<{
  [key: string]: boolean;
}>({
  ...Object.keys(EXPNSE_CATEGORY).reduce((a, c) => ({ ...a, [c]: false }), {}),
  ALL: true,
});
const selectionBudgetTypeAtom = atomWithReset({
  CASH: false,
  CARD: false,
  ALL: true,
});

const useDataFilter = ({
  dataList,
}: {
  dataList: (IncomeQueryData | ExpenseQueryData)[];
}) => {
  const selectionDate = useAtomValue(selectionDateAtom);
  const selectionCategories = useAtomValue(selectionCategoriesAtom);
  const selectionBudgetType = useAtomValue(selectionBudgetTypeAtom);
  const filteredDataList = useMemo(() => {
    let filtered = [...dataList];
    if (!selectionDate.ALL) {
      filtered = filtered.filter(
        (data) =>
          new Date(data.date).getDate() >= selectionDate.startDate.getDate() &&
          new Date(data.date).getDate() <= selectionDate.endDate.getDate()
      );
    }
    if (!selectionCategories.ALL) {
      filtered = filtered.filter(
        (data) =>
          Object.hasOwn(data, "category") &&
          selectionCategories[(data as ExpenseQueryData).category]
      );
    }
    if (!selectionBudgetType.ALL) {
      filtered = filtered.filter(
        (data) => selectionBudgetType[data.Budget.type as "CARD" | "CASH"]
      );
    }
    return filtered;
  }, [dataList, selectionDate, selectionCategories, selectionBudgetType]);

  const filterMode = useMemo(
    () =>
      !selectionDate.ALL ||
      !selectionCategories.ALL ||
      !selectionBudgetType.ALL,
    [selectionDate, selectionCategories, selectionBudgetType]
  );
  return { filteredDataList, filterMode };
};
const FilterOptionModal = () => {
  const [filterType, setFilterType] = useAtom(filterTypeAtom);
  return (
    <Modal
      open={filterType !== ""}
      onOpenChange={(o) => {
        !o && setFilterType("");
      }}
    >
      <Modal.Content
        onCloseAutoFocus={() => setFilterType("")}
        className="rounded-b-none top-auto bottom-0 translate-y-0 w-full"
      >
        <Modal.Title className="!text-lg">
          {
            {
              date: "기간 선택",
              category: "카테고리 선택",
              budgetType: "예산 타입 선택",
            }[filterType as filterType]
          }
        </Modal.Title>
        {
          {
            date: <DateFilterContent />,
            category: <CatogryFilterContent />,
            budgetType: <BudgetTypeFilterContent />,
          }[filterType as filterType]
        }
      </Modal.Content>
    </Modal>
  );
};
const DateFilterContent = () => {
  const setFilterType = useSetAtom(filterTypeAtom);
  const [selectionDate, setSelectionDate] = useAtom(selectionDateAtom);
  const [newSelectionDate, setNewSelectionDate] = useState({
    ...selectionDate,
  });
  const resetSelection = useResetAtom(selectionDateAtom);
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => {
          setNewSelectionDate((p) => ({ ...p, ALL: !p.ALL }));
        }}
        className={clsx(
          "flex justify-between rounded-xl mt-2",
          newSelectionDate.ALL ? "text-blue" : "text-grey-100"
        )}
      >
        <span>전체</span>
        <CheckSharpIcon />
      </Button>
      <hr className="border-grey-100" />
      <div
        className={clsx(
          newSelectionDate.ALL && "opacity-50",
          "duration-300 rounded-xl overflow-hidden"
        )}
      >
        <DateRange
          ranges={[newSelectionDate]}
          onChange={(ranges) =>
            setNewSelectionDate({
              ALL: false,
              startDate: ranges?.["selection"].startDate ?? new Date(),
              endDate: ranges?.["selection"].endDate ?? new Date(),
              key: ranges?.["selection"].key ?? "selection",
            })
          }
          locale={ko}
          rangeColors={[newSelectionDate.ALL ? "#C5C5C5" : "#3D91FF"]}
        />
      </div>
      <Modal.Footer
        confirmText="적용"
        onClickConfirm={() => {
          newSelectionDate.ALL
            ? resetSelection()
            : setSelectionDate(newSelectionDate);
          setFilterType("");
        }}
      />
    </div>
  );
};
const CatogryFilterContent = () => {
  const setFilterType = useSetAtom(filterTypeAtom);
  const [selectionCategories, setSelectionCatogories] = useAtom(
    selectionCategoriesAtom
  );
  const [newSelectionCategories, setNewSelectionCategories] = useState({
    ...selectionCategories,
  });
  const resetSelection = useResetAtom(selectionCategoriesAtom);
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => {
          setNewSelectionCategories((p) => ({ ...p, ALL: !p.ALL }));
        }}
        className={clsx(
          "flex justify-between rounded-xl mt-2",
          newSelectionCategories.ALL ? "text-blue" : "text-grey-100"
        )}
      >
        <span>전체</span>
        <CheckSharpIcon />
      </Button>
      <hr className="border-grey-100" />
      <div className="flex border border-grey-50 rounded-md">
        {Object.keys(EXPNSE_CATEGORY).map((category) => (
          <Button
            key={category}
            className={clsx(
              newSelectionCategories[category] && !newSelectionCategories.ALL
                ? "bg-grey-light-300 text-blue"
                : "text-grey-100",
              "duration-300 [&>span]:!text-xs"
            )}
            onClick={() =>
              setNewSelectionCategories((p) => ({
                ...p,
                ALL: false,
                [category]: !p[category],
              }))
            }
          >
            <CategoryTag category={category} withDescription />
          </Button>
        ))}
      </div>
      <Modal.Footer
        confirmText="적용"
        onClickConfirm={() => {
          newSelectionCategories.ALL
            ? resetSelection()
            : setSelectionCatogories(newSelectionCategories);
          setFilterType("");
        }}
      />
    </div>
  );
};
const BudgetTypeFilterContent = () => {
  const setFilterType = useSetAtom(filterTypeAtom);
  const [selectionBudgetType, setSelectionBudgetType] = useAtom(
    selectionBudgetTypeAtom
  );
  const [newSelectionBudgetType, setNewSelectionBudgetType] = useState({
    ...selectionBudgetType,
  });
  const resetSelection = useResetAtom(selectionBudgetTypeAtom);
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => {
          setNewSelectionBudgetType((p) => ({ ...p, ALL: !p.ALL }));
        }}
        className={clsx(
          "flex justify-between rounded-xl mt-2",
          newSelectionBudgetType.ALL ? "text-blue" : "text-grey-100"
        )}
      >
        <span>전체</span>
        <CheckSharpIcon />
      </Button>
      <hr className="border-grey-100" />
      <div className="flex border border-grey-50 rounded-md">
        <Button
          className={clsx(
            newSelectionBudgetType["CASH"] && !newSelectionBudgetType.ALL
              ? "bg-grey-light-300 text-blue"
              : "text-grey-300",
            "flex gap-1 flex-1 justify-center border-r border-grey-50"
          )}
          onClick={() =>
            setNewSelectionBudgetType((p) => ({
              ...p,
              CASH: !p["CASH"],
              ALL: false,
            }))
          }
          value={"CASH"}
          name="type"
        >
          <PaymentsTwoToneIcon />
          현금
        </Button>
        <Button
          className={clsx(
            newSelectionBudgetType["CARD"] && !newSelectionBudgetType.ALL
              ? "bg-grey-light-300 text-blue"
              : "text-grey-300",
            "flex gap-1 flex-1 justify-center"
          )}
          onClick={() =>
            setNewSelectionBudgetType((p) => ({
              ...p,
              CARD: !p["CARD"],
              ALL: false,
            }))
          }
          value={"CARD"}
          name="type"
        >
          <PaymentTwoToneIcon />
          카드
        </Button>
      </div>
      <Modal.Footer
        confirmText="적용"
        onClickConfirm={() => {
          newSelectionBudgetType.ALL
            ? resetSelection()
            : setSelectionBudgetType(newSelectionBudgetType);
          setFilterType("");
        }}
      />
    </div>
  );
};
const FilterOptionModalTrigger = ({
  children,
  filterType,
  className,
}: PropsWithChildren<{ filterType: filterType; className?: string }>) => {
  const setFilterType = useSetAtom(filterTypeAtom);
  return (
    <Button
      onClick={() => {
        setFilterType(filterType);
      }}
      className={className}
    >
      {children}
    </Button>
  );
};
FilterOptionModal.Trigger = FilterOptionModalTrigger;
FilterOptionModal.useDataFilter = useDataFilter;
export default FilterOptionModal;
