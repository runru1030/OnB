import InternalBudgetModal, { Trigger } from "./Modal";

type InternalBudgetModalType = typeof InternalBudgetModal;
interface BudgetModalType extends InternalBudgetModalType {
  Trigger: typeof Trigger;
}

const BudgetModal = InternalBudgetModal as BudgetModalType;
BudgetModal.Trigger = Trigger;
export default BudgetModal;
