import { useNavigate } from "react-router-dom";

interface UploadPopupProps {
  onClose: () => void;
}

export default function UploadPopup({ onClose }: UploadPopupProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
      <div className="bg-white w-full rounded-t-[25px] shadow-xl p-6 animate-slide-up">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              onClose();
              navigate("/upload/camera");
            }}
            className="py-3 border-b text-[15px] font-medium hover:text-[#FF7070]"
          >
            Camera
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/upload/gallery");
            }}
            className="py-3 text-[15px] font-medium hover:text-[#FF7070]"
          >
            Upload from Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
