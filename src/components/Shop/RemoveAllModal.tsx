import Modal from '../common/Modal';

interface RemoveAllModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RemoveAllModal = ({ show, onClose, onConfirm }: RemoveAllModalProps) => {
  if (!show) return null;

  return (
    <Modal title="아이템 모두 벗기" onClose={onClose}>
      <div className="flex flex-col items-center text-center px-3.5 w-full">
        <p className="text-gray-700 mb-6">
          착용 중인
          <br /> 모든 아이템을 벗으시겠습니까?
        </p>

        <div className="flex w-full gap-4 justify-between">
          <button
            onClick={onConfirm}
            className="flex-1 whitespace-nowrap px-6 py-2 bg-[#FF7070] text-white rounded-lg font-semibold"
          >
            벗기
          </button>
          <button
            onClick={onClose}
            className="whitespace-nowrap px-6 py-2 bg-[#EAEAEA] text-[#8D8D8D] rounded-lg font-semibold"
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveAllModal;
