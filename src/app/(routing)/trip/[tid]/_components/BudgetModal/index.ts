import InternalBudgetModal, { Trigger, useModal } from "./Modal";

type InternalBudgetModalType = typeof InternalBudgetModal;
interface BudgetModalType extends InternalBudgetModalType {
  Trigger: typeof Trigger;
  useModal: typeof useModal;
}

const BudgetModal = InternalBudgetModal as BudgetModalType;
BudgetModal.Trigger = Trigger;
BudgetModal.useModal = useModal;
export default BudgetModal;
