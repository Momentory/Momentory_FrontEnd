import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectCharacterPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const characters = [
    { id: "1", name: "Cat", img: "/images/char1.png" },
    { id: "2", name: "Dog", img: "/images/char2.png" },
  ];

  const handleNext = () => {
    if (!selected) {
      alert("캐릭터를 선택해주세요!");
      return;
    }
    const chosen = characters.find((c) => c.id === selected);
    alert(`${chosen?.name} 캐릭터가 선택되었습니다!`);
    navigate("/account");
  };

  return (
    <div className="relative flex flex-col items-center justify-start w-[390px] h-[844px] mx-auto bg-white overflow-hidden">
      {/* 뒤로가기 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[20px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      <h1
        className="absolute left-[30px] top-[110px] text-[29px] font-semibold text-black leading-tight whitespace-pre-line text-left"
      >
        {"캐릭터를\n선택하세요"}
      </h1>

      {/* 캐릭터 영역 */}
      <div className="relative flex justify-center items-end mt-[280px] mb-[40px]">
        {/* 왼쪽 캐릭터 */}
        <div
          onClick={() => setSelected("1")}
          className="relative flex flex-col items-center cursor-pointer transition-all duration-300 -mr-[150px]"
          style={{
            width: "320px",
            height: "360px",
            justifyContent: "flex-end",
          }}
        >
          {/* 화살표 */}
          {selected === "1" && (
            <div
              className="absolute"
              style={{
                top: "40px",
                left: "20%",
                transform: "translateX(-50%) rotate(180deg)",
                width: 0,
                height: 0,
                borderLeft: "22px solid transparent",
                borderRight: "22px solid transparent",
                borderBottom: "32px solid #FF7070",
              }}
            />
          )}
          {/* 이미지 */}
          <img
            src={characters[0].img}
            alt="Cat"
            className={`transition-all duration-300 ${
              selected === "1" ? "opacity-100 scale-110" : "opacity-30 scale-95"
            }`}
            style={{
              width: "320px",
              height: "360px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* 오른쪽 캐릭터 */}
        <div
          onClick={() => setSelected("2")}
          className="relative flex flex-col items-center cursor-pointer transition-all duration-300 -ml-[120px]"
          style={{
            width: "320px",
            height: "340px",
            justifyContent: "flex-end",
          }}
        >
          {/* 화살표 */}
          {selected === "2" && (
            <div
              className="absolute"
              style={{
                top: "20px",
                left: "70%",
                transform: "translateX(-50%) rotate(180deg)",
                width: 0,
                height: 0,
                borderLeft: "22px solid transparent",
                borderRight: "22px solid transparent",
                borderBottom: "32px solid #FF7070",
              }}
            />
          )}
          {/* 이미지 */}
          <img
            src={characters[1].img}
            alt="Dog"
            className={`transition-all duration-300 ${
              selected === "2" ? "opacity-100 scale-110" : "opacity-30 scale-95"
            }`}
            style={{
              width: "300px",
              height: "340px",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      {/* 하단 바 */}
      <div className="relative w-[300px] h-[7px] bg-gray-200 rounded-full mb-[50px] -mt-[120px]">
        <div
          className={`absolute top-0 left-0 h-full bg-[#FF7070] rounded-full transition-all duration-500 ${
            selected === "1"
              ? "w-1/2"
              : selected === "2"
              ? "w-1/2 left-1/2"
              : "w-0"
          }`}
        ></div>
      </div>

      {/* 버튼 */}
      <button
        disabled={!selected}
        onClick={handleNext}
        className={`w-[330px] h-[70px] rounded-[25px] text-white text-[22px] font-semibold transition active:scale-95 ${
          selected ? "bg-[#FF7070]" : "bg-gray-300 cursor-not-allowed"
        }`} 
        style={{ position: "absolute", bottom: "20px" }}
      >
        캐릭터 선택 완료
      </button>
    </div>
  );
}
