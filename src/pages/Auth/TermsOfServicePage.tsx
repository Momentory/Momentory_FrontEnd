import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function TermsOfServicePage() {
  const navigate = useNavigate();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [checked, setChecked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 스크롤 이벤트
  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element) return;
    const { scrollTop, scrollHeight, clientHeight } = element;
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

      <h1 className="text-[22px] font-semibold text-black mb-6">
        개인정보 및 저작권 안내
      </h1>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-[332px] h-[468px] border border-gray-300 rounded-[8px] p-5 overflow-y-scroll text-[14px] text-gray-700 leading-relaxed whitespace-pre-line"
      >
📜 <strong>개인정보 및 저작권 안내</strong>

📌 <strong>개인정보 처리방침</strong>
모멘토리는 회원가입 시 닉네임, 이메일, 생년월일 등 최소한의 정보만을 수집하며,
서비스 제공 및 캐릭터 성장 시스템 운영을 위해서만 이용합니다.
수집된 정보는 회원 탈퇴 후 30일 이내 자동 삭제되며,
제3자에게 제공되지 않습니다.

📌 <strong>이용약관</strong>
사용자는 타인의 권리를 침해하지 않으며, 서비스 내 게시물(사진·메모 등)은
본인의 창작물이어야 합니다.
공개로 설정된 콘텐츠는 비상업적 홍보(예: 지역 앨범, 문화 지도)에 활용될 수 있습니다.
불법 촬영물 또는 타인의 얼굴이 포함된 무단 게시물은 즉시 삭제 및 제재 대상이 됩니다.

📌 <strong>저작권 및 초상권 안내</strong>
업로드한 사진의 저작권은 사용자 본인에게 있습니다.
단, 공개 게시물은 모멘토리 내 ‘공유 지도’ 등에서 노출될 수 있습니다.
타인의 초상이나 저작물을 포함할 경우, 이용자는 사전 동의를 받아야 하며,
법적 분쟁 발생 시 모든 책임은 게시자에게 있습니다.

📌 <strong>운영자 책임 및 신고 절차</strong>
서비스는 이용자가 게시한 콘텐츠의 법적 책임을 대리하지 않습니다.
신고 접수 시 48시간 내 처리 결과를 통보하며,
불법 콘텐츠는 즉시 삭제 조치됩니다.
      </div>

      <div className="flex items-center mt-4 space-x-2">
        <input
          type="checkbox"
          id="agree"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="w-[18px] h-[18px] accent-[#FF7070]"
          disabled={!scrolledToBottom} // 스크롤 전엔 체크 비활성화
        />
        <label
          htmlFor="agree"
          className={`text-[14px] ${
            scrolledToBottom ? "text-gray-700" : "text-gray-400"
          }`}
        >
          위 내용을 모두 확인하였으며, 개인정보 및 저작권 정책에 동의합니다.
        </label>
      </div>

      <div className="flex justify-between w-[332px] mt-8 space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-[60px] bg-gray-300 text-gray-700 text-[16px] font-semibold rounded-[20px] active:scale-95 transition"
        >
          취소
        </button>
        <button
          disabled={!checked}
          onClick={() => navigate(-1)}
          className={`flex-1 h-[60px] text-white text-[16px] font-semibold rounded-[20px] active:scale-95 transition ${
            checked ? "bg-[#FF7070]" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          동의하기
        </button>
      </div>

      {!scrolledToBottom && (
        <p className="text-gray-400 text-[13px] mt-3 self-center">
          모든 내용을 끝까지 읽으면 체크 및 동의가 활성화됩니다.
        </p>
      )}
    </div>
  );
}
