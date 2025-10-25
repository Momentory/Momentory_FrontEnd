import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectCharacterPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  // 캐릭터 리스트
  const characters = [
    { id: "1", name: "Cat", img: "/images/char1.png" },
    { id: "2", name: "Dog", img: "/images/char2.png" },
  ];

  // 캐릭터 선택 후 다음 단계 이동
  const handleNext = () => {
    if (!selected) {
      alert("캐릭터를 선택해주세요!");
      return;
    }
    alert(`${characters.find((c) => c.id === selected)?.name} 캐릭터가 선택되었습니다!`);
    navigate("/account-created"); // 회원가입 완료 페이지로 이동 (원하는 경로로 변경 가능)
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white px-[20px] pt-[100px] pb-[40px] relative">
      {/*  뒤로가기 버튼 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[25px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/*  타이틀 */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-[24px] font-semibold mb-2 text-center">
          캐릭터를 선택하세요
        </h1>
        <p className="text-gray-500 text-[14px]">
          나만의 대표 캐릭터를 골라주세요!
        </p>
      </div>

      {/* 캐릭터 선택 영역 */}
      <div className="flex justify-center items-center gap-[10px] mb-12">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => setSelected(char.id)}
            className={`relative w-[200px] h-[200px] rounded-[30px] flex items-center justify-center cursor-pointer transition-all duration-300 ${
              selected === char.id
                ? "scale-105 border-4 border-[#FF7070] shadow-[0_0_20px_rgba(255,112,112,0.4)]"
                : "border border-gray-200 hover:scale-105"
            }`}
          >
            <img
              src={char.img}
              alt={char.name}
              className="w-[160px] h-[160px] object-contain"
            />
          </div>
        ))}
      </div>

      {/* 선택된 캐릭터 이름 표시 */}
      {selected && (
        <p className="text-[18px] font-semibold text-[#FF7070] mb-4">
          {characters.find((c) => c.id === selected)?.name} 선택됨 
        </p>
      )}

      {/* 버튼 */}
      <button
        disabled={!selected}
        onClick={handleNext}
        className={`w-[330px] h-[70px] text-white text-[18px] font-semibold rounded-[25px] transition active:scale-95 ${
          selected ? "bg-[#FF7070]" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        캐릭터 생성
      </button>
    </div>
  );
}
