import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function TermsOfServicePage() {
  const navigate = useNavigate();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 스크롤 감지 함수
  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    // 맨 아래까지 스크롤 시 true
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setScrolledToBottom(true);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-screen bg-white px-[29px] pt-[120px] relative">
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[30px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      <h1 className="text-[24px] font-semibold text-black mb-6">
        Terms of Service
      </h1>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-[332px] h-[468px] border border-gray-300 rounded-[8px] p-4 overflow-y-scroll leading-relaxed text-[14px] text-gray-700"
      >
        <p className="font-bold mb-2">1. Acceptance Of Terms</p>
        <p className="mb-4">
          terms of service terms of service terms of service terms of service
          terms of service terms of service terms of service terms of service
          terms of service terms of service terms of service terms of service
          terms of service terms of service
        </p>

        <p className="font-bold mb-2">2. Use Of The Service</p>
        <p className="mb-4">
          terms of service terms of service terms of service terms of service
          terms of service terms of service terms of service terms of service
          terms of service terms of service terms of service terms of service
          terms of service terms of service
        </p>

        <p className="font-bold mb-2">3. User Account</p>
        <p className="mb-4">
          terms of service terms of service terms of service terms of service
          terms of service terms of service terms of service terms of service
          terms of service terms of service terms of service terms of service
          terms of service terms of service
        </p>

        <p className="font-bold mb-2">4. Privacy Policy</p>
        <p>
          terms of service terms of service terms of service terms of service
          terms of service terms of service terms of service terms of service
          terms of service terms of service terms of service terms of service
          terms of service terms of service
        </p>
      </div>

      <button
        onClick={() => navigate(-1)}
        disabled={!scrolledToBottom}
        className={`w-[332px] h-[70px] text-white text-[18px] font-semibold rounded-[25px] mt-8 transition active:scale-95 ${
          scrolledToBottom ? "bg-[#FF7070]" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Agree
      </button>

      {!scrolledToBottom && (
        <p className="text-gray-400 text-[13px] mt-2 self-center">
          👇 모든 내용을 읽으면 동의 버튼이 활성화됩니다.
        </p>
      )}
    </div>
  );
}
