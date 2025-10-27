import { Camera, Image } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#F9FAFB] px-8">
      {/* 타이틀 */}
      <h2 className="text-[18px] font-semibold text-gray-800 mb-6">
        사진 업로드
      </h2>

      {/* 카메라 업로드 버튼 */}
      <button
        className="w-full bg-white flex items-center justify-center gap-3 px-4 py-4 rounded-[15px] shadow-md active:scale-95 transition mb-4"
        onClick={() => alert("카메라 실행 (추후 연결 예정)")}
      >
        <Camera className="text-gray-700" size={22} />
        <span className="text-[15px] font-medium text-gray-800">카메라</span>
      </button>

      {/* 구분선 */}
      <div className="w-full h-[1px] bg-gray-200 my-2" />

      {/* 갤러리 업로드 버튼 */}
      <button
        className="w-full bg-white flex items-center justify-center gap-3 px-4 py-4 rounded-[15px] shadow-md active:scale-95 transition"
        onClick={() => alert("갤러리에서 업로드 (추후 연결 예정)")}
      >
        <Image className="text-gray-700" size={22} />
        <span className="text-[15px] font-medium text-gray-800">
          갤러리에서 업로드
        </span>
      </button>
    </div>
  );
}
