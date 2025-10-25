import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectCharacterPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  // 두 개의 캐릭터 이미지
  const characters = [
    { id: "1", name: "Character A", img: "/images/char1.png" },
    { id: "2", name: "Character B", img: "/images/char2.png" },
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
        Choose Your Character
      </h1>

      {/* 캐릭터 선택 */}
      <div className="flex justify-center items-center gap-8 mb-10">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] rounded-2xl overflow-hidden border-4 cursor-pointer transition-all duration-200 ${
              selected === char.id
                ? "border-[#FF7070] scale-105 shadow-xl"
                : "border-gray-300 hover:scale-102"
            }`}
            onClick={() => setSelected(char.id)}
          >
            <img
              src={char.img}
              alt={char.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <button
        disabled={!selected}
        onClick={() => navigate("/home")}
        className={`w-[330px] h-[70px] text-white text-[18px] font-semibold rounded-[25px] mt-10 transition active:scale-95 ${
          selected ? "bg-[#FF7070]" : "bg-gray-300"
        }`}
      >
        I Chose One
      </button>
    </div>
  );
}
