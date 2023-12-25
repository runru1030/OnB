import InternalDetailModal, { Trigger } from "./Modal";

type InternalDetailModalType = typeof InternalDetailModal;
interface DetailModalType extends InternalDetailModalType {
  Trigger: typeof Trigger;
}

const DetailModal = InternalDetailModal as DetailModalType;
DetailModal.Trigger = Trigger;
export default DetailModal;
