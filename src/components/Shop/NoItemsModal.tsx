import Modal from '../common/Modal';

interface NoItemsModalProps {
  show: boolean;
  onClose: () => void;
}

const NoItemsModal = ({ show, onClose }: NoItemsModalProps) => {
  if (!show) return null;

  return (
    <Modal title="알림" onClose={onClose}>
      <div className="flex flex-col items-center text-center px-3.5 w-full">
        <p className="text-gray-700 mb-4">착용 중인 아이템이 없습니다.</p>

        <div className="flex w-full justify-center">
          <button
            onClick={onClose}
            className="whitespace-nowrap px-6 py-2 bg-[#FF7070] text-white rounded-lg font-semibold w-full"
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NoItemsModal;
