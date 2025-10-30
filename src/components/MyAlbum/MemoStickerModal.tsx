import Modal from '../common/Modal';
import Sticker from '../../assets/stamp/남한산성.svg';
import Lock from '../../assets/icons/lockIcon.svg?react';

interface MemoStickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MemoStickerModal: React.FC<MemoStickerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 예시로 15개의 스티커 데이터
  const stickers = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    locked: i % 4 === 0,
  }));

  return (
    <Modal title="스티커 추가" onClose={onClose}>
      <div className="w-full px-4 py-4 grid grid-cols-3 gap-4 justify-items-center">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className={`relative w-20 h-20 rounded-xl border-2 ${
              sticker.locked ? 'border-[#C3C3C3]' : 'border-black cursor-pointer'
            } flex items-center justify-center`}
          >
            {sticker.locked ? (
              <Lock className="w-8 h-8 text-gray-400" />
            ) : (
              <img src={Sticker} alt="스티커" className="w-12 h-12 object-contain" />
            )}
          </div>
        ))}
      </div>
      
    </Modal>
  );
};

export default MemoStickerModal;
