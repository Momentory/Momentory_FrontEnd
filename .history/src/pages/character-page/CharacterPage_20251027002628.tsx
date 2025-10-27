import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function CharacterPage() {
  const navigate = useNavigate();

  // 임시 데이터 (API 연동 전)
  const [level, setLevel] = useState(35);
  const [exp, setExp] = useState(70); // %
  const [points, setPoints] = useState(1500);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      {/* 상단 헤더 */}
      <div className="sticky top-0 w-full bg-white flex items-center justify-between px-4 py-3 border-b shadow-sm z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-800">
          나의 캐릭터
        </h1>
        <div className="w-[38px]" />
      </div>

      {/* 캐릭터 섹션 */}
      <div className="flex flex-col items-center mt-8">
        <img
          src="/images/character.png"
          alt="캐릭터"
          className="w-[140px] h-[140px] object-contain mb-3"
        />
        <p className="text-[16px] font-semibold text-gray-800">
          Lv.{level} 여행자
        </p>
      </div>

      {/* 경험치 게이지 */}
      <div className="w-[85%] mt-5">
        <p className="text-[14px] text-gray-600 mb-1">
          경험치: {exp}% (다음 레벨까지 {100 - exp}%)
        </p>
        <div className="w-full h-[10px] bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF7070] transition-all duration-500"
            style={{ width: `${exp}%` }}
          />
        </div>
      </div>

      {/* 포인트 & 업적 */}
      <div className="w-[85%] flex justify-between mt-6">
        <div className="flex flex-col items-center">
          <p className="text-[13px] text-gray-500">포인트</p>
          <p className="text-[15px] font-semibold text-gray-800">{points}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[13px] text-gray-500">획득 업적</p>
          <p className="text-[15px] font-semibold text-gray-800">7개</p>
        </div>
      </div>

      {/* 여행 떠나기 버튼 */}
      <button
        onClick={() => navigate("/travel")}
        className="mt-10 bg-[#FF7070] text-white font-semibold text-[15px] px-10 py-3 rounded-full shadow hover:bg-[#ff5a5a] transition"
      >
        여행 떠나기 
      </button>
    </div>
  );
}
