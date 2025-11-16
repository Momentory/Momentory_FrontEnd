import Modal from '../common/Modal';

interface ClothingConflictModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'clothing-to-other' | 'other-to-clothing';
}

const ClothingConflictModal = ({ show, onClose, onConfirm, type }: ClothingConflictModalProps) => {
  if (!show) return null;

  const message = type === 'clothing-to-other'
    ? '의상을 착용한 상태에서는 다른 아이템을 착용할 수 없습니다.'
    : '다른 아이템을 착용한 상태에서는 의상을 착용할 수 없습니다.';

  const confirmText = '모두 벗고 착용하기';

  return (
    <Modal title="아이템 착용" onClose={onClose}>
      <div className="flex flex-col items-center text-center px-4 w-full">
        <p className="text-gray-700 mb-6 whitespace-pre-line">
          {message}
          <br /><br />
          모든 아이템을 벗고 착용하시겠습니까?
        </p>

        <div className="flex w-full gap-4 justify-between">
          <button
            onClick={onClose}
            className="flex-1 whitespace-nowrap px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 whitespace-nowrap px-6 py-2 bg-[#FF7070] text-white rounded-lg font-semibold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ClothingConflictModal;
