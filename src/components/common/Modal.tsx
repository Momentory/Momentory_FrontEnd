import CloseIcon from '../../assets/icons/closeIcon.svg?react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-500 px-5">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md relative bg-white rounded-2xl shadow-lg w-80 px-4 py-4 flex flex-col items-center max-h-[80vh] overflow-y-auto">
        <div className="relative flex items-center justify-center w-full mb-4">
          <button
            onClick={onClose}
            aria-label="닫기"
            className="absolute left-0 cursor-pointer"
          >
            <CloseIcon />
          </button>

          <h1 className="text-xl font-bold text-center">{title}</h1>
        </div>
        <div className="flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
