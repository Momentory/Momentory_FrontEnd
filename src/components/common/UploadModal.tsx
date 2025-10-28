// src/components/home/UploadModal.tsx
import { X } from "lucide-react";

interface UploadModalProps {
  onClose: () => void;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex justify-center items-end z-[9999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-[90%] max-w-[320px] mb-[100px] pb-3 animate-[slideUp_0.25s_ease-out]"
      >
        {/* 상단 */}
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h3 className="text-[15px] font-semibold text-gray-800">사진 업로드</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* 버튼 목록 */}
        <div className="flex flex-col py-2">
          <button
            onClick={() => {
              alert("카메라 실행 예정");
              onClose();
            }}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <img src="/images/Camera.png" alt="camera" className="w-6 h-6" />
            <span className="text-[15px] font-medium text-gray-800">카메라</span>
          </button>

          <div className="border-t my-1" />

          <button
            onClick={() => {
              alert("갤러리 업로드 예정");
              onClose();
            }}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition"
          >
            <img src="/images/image.png" alt="gallery" className="w-6 h-6" />
            <span className="text-[15px] font-medium text-gray-800">
              갤러리에서 업로드
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
