import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectCharacterPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  // 예시 캐릭터 (이미지 경로는 public/images 안에 넣기)
  const characters = [
    { id: "1", name: "Character 1", img: "/images/char1.png" },
    { id: "2", name: "Character 2", img: "/images/char2.png" },
    { id: "3", name: "Character 3", img: "/images/char3.png" },
  ];

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white px-[30px] pt-[100px] pb-[40px] relative">
      {/* 🔙 뒤로가기 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[25px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/* 제목 */}
      <h1 className="text-[22px] font-semibold mb-10 self-start">
        Choose Your Character
      </h1>

      {/* 캐릭터 선택 영역 */}
      <div className="grid grid-cols-3 gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`w-[90px] h-[90px] rounded-full border-4 flex items-center justify-center cursor-pointer transition ${
              selected === char.id
                ? "border-[#FF7070] scale-110"
                : "border-gray-200 hover:scale-105"
            }`}
            onClick={() => setSelected(char.id)}
          >
            <img
              src={char.img}
              alt={char.name}
              className="w-[70px] h-[70px] object-cover rounded-full"
            />
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <button
        disabled={!selected}
        onClick={() => navigate("/home")}
        className={`w-[330px] h-[60px] text-white text-[16px] font-semibold rounded-[20px] mt-10 transition active:scale-95 ${
          selected ? "bg-[#FF7070]" : "bg-gray-300"
        }`}
      >
        I Chose One
      </button>
    </div>
  );
}
