import { useNavigate } from 'react-router-dom';
import { Camera, Image, X } from 'lucide-react';

interface PhotoUploadBottomSheetProps {
  onClose: () => void;
  onGalleryClick: () => void;
}

export default function PhotoUploadBottomSheet({
  onClose,
  onGalleryClick,
}: PhotoUploadBottomSheetProps) {
  const navigate = useNavigate();

  const handleGalleryUpload = () => {
    onGalleryClick();
  };

  const handleCameraOpen = () => {
    navigate('/upload', { state: { cameraStream: true } });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl shadow-xl w-full max-w-[450px] pb-24 animate-[slideUp_0.25s_ease-out]"
      >
        <div className="flex justify-between items-center px-7 py-4 border-b border-[#E6D5D5]">
          <h3 className="text-[16px] font-semibold text-gray-800">
            사진 업로드
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col py-3 px-4 gap-2">
          <button
            onClick={handleCameraOpen}
            className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition rounded-xl cursor-pointer"
          >
            <Camera className="text-gray-700" size={24} />
            <span className="text-[15px] font-medium text-gray-800">
              카메라
            </span>
          </button>

          <button
            onClick={handleGalleryUpload}
            className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition rounded-xl cursor-pointer"
          >
            <Image className="text-gray-700" size={24} />
            <span className="text-[15px] font-medium text-gray-800">
              갤러리에서 업로드
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
