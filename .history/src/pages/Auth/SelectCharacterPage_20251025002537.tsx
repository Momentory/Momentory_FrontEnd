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
      {/* 뒤로가기 */}
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
      <div className="flex justify-center items-center gap-6 mb-50">
        {characters.map((char, idx) => (
          <div
            key={char.id}
            className={`relative w-[250px] h-[250px] rounded-[20px] overflow-hidden border-4 cursor-pointer transition-all duration-200 flex items-center justify-center ${
              selected === char.id
                ? "border-[#FF7070] scale-105 shadow-md z-10"
                : "border-gray-200 hover:scale-102 z-0"
            }`}
            onClick={() => setSelected(char.id)}
          >
            <img
              src={char.img}
              alt={char.name}
              className="w-[180px] h-[180px] object-contain"
            />
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <button
        disabled={!selected}
        onClick={() => navigate("/home")}
        className={`w-[330px] h-[65px] text-white text-[18px] font-semibold rounded-[25px] mt-8 transition active:scale-95 ${
          selected ? "bg-[#FF7070]" : "bg-gray-300"
        }`}
      >
        I Chose One
      </button>
    </div>
  );
}
