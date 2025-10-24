import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectCharacterPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const characters = [
    { id: "1", name: "Cat", img: "/images/char1.png" },
    { id: "2", name: "Dog", img: "/images/char2.png" },
  ];

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white px-[20px] pt-[100px] pb-[40px] relative">
      {/* 🔙 뒤로가기 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[25px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/* 제목 */}
      <h1 className="text-[24px] font-semibold mb-10">
        캐릭터를 선택하세요
      </h1>

      {/* 캐릭터 선택 */}
      <div className="flex justify-center items-center -space-x-[200px] mb-10">
        {characters.map((char, idx) => (
          <div
            key={char.id}
            className={`relative w-[280px] h-[280px] cursor-pointer transition-all duration-200 flex items-center justify-center ${
              selected === char.id
                ? "scale-105 drop-shadow-[0_0_10px_rgba(255,112,112,0.6)]"
                : "hover:scale-102"
            }`}
            onClick={() => setSelected(char.id)}
          >
            <img
              src={char.img}
              alt={char.name}
              className="w-[260px] h-[260px] object-contain scale-90"
            />
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <button
        disabled={!selected}
        onClick={() => navigate("/account")}
        className={`w-[330px] h-[70px] text-white text-[18px] font-semibold rounded-[25px] mt-10 transition active:scale-95 ${
          selected ? "bg-[#FF7070]" : "bg-gray-300"
        }`}
      >
        캐릭터 생성
      </button>
    </div>
  );
}
