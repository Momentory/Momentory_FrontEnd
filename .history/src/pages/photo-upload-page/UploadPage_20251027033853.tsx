import { useNavigate } from "react-router-dom";
import { Camera, Image, ArrowLeft } from "lucide-react";

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-[17px] font-semibold text-gray-800">업로드</h2>
        <div className="w-[22px]" /> {/* 오른쪽 공간 맞추기 */}
      </div>

      {/* 선택 카드 영역 */}
      <div className="w-full max-w-[400px] mt-16 px-8 flex flex-col gap-5">
        {/* 카메라 */}
        <button
          className="w-full bg-white flex items-center gap-3 px-4 py-4 rounded-[15px] shadow-md active:scale-95 transition"
          onClick={() => alert("📸 카메라 실행 (추후 연결)")}
        >
          <Camera className="text-gray-700" size={22} />
          <span className="text-[15px] font-medium text-gray-800">카메라</span>
        </button>

        {/* 구분선 */}
        <div className="w-full h-[1px] bg-gray-200" />

        {/* 갤러리 업로드 */}
        <button
          className="w-full bg-white flex items-center gap-3 px-4 py-4 rounded-[15px] shadow-md active:scale-95 transition"
          onClick={() => alert("갤러리에서 업로드 (추후 연결)")}
        >
          <Image className="text-gray-700" size={22} />
          <span className="text-[15px] font-medium text-gray-800">
            갤러리에서 업로드
          </span>
        </button>
      </div>
    </div>
  );
}
