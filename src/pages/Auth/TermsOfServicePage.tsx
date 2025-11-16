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

  // 줄바꿈이 유지되는 정책 텍스트
  const policyText = `
개인정보 처리방침 및 이용약관

제1조 (목적)
본 약관은 모멘토리(이하 '회사')가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (개인정보의 수집 및 이용)
1. 회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다.
   - 필수항목: 이메일, 비밀번호, 닉네임, 이름, 생년월일, 성별, 전화번호
   - 선택항목: 프로필 사진, 자기소개
2. 수집된 개인정보는 서비스 제공, 회원 관리, 서비스 개선의 목적으로만 이용됩니다.
3. 회사는 회원의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.

제3조 (개인정보의 보유 및 파기)
1. 회원 탈퇴 시 개인정보는 지체 없이 파기됩니다. 다만, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관 후 파기합니다.
2. 전자상거래법 등 관련 법령에 따라 보관이 필요한 경우 다음과 같이 보관합니다.
   - 계약 또는 청약철회 등에 관한 기록: 5년
   - 소비자 불만 또는 분쟁처리에 관한 기록: 3년

제4조 (회원의 의무)
1. 회원은 본인의 계정 정보를 제3자에게 이용하게 해서는 안 됩니다.
2. 회원은 서비스 이용 시 다음 각 호의 행위를 해서는 안 됩니다.
   - 타인의 정보 도용
   - 허위 내용의 등록
   - 타인의 명예를 손상시키거나 불이익을 주는 행위
   - 저작권 등 타인의 권리를 침해하는 행위
   - 음란, 폭력적 또는 불법적인 내용의 게시
   - 서비스의 안정적 운영을 방해하는 행위

제5조 (게시물의 관리)
1. 회원이 작성한 게시물의 저작권은 회원 본인에게 귀속됩니다.
2. 회사는 게시물이 다음 각 호에 해당한다고 판단되는 경우 사전 통지 없이 삭제할 수 있습니다.
   - 타인을 비방하거나 명예를 훼손하는 내용
   - 음란물, 불법 촬영물 등 법령에 위배되는 내용
   - 타인의 저작권, 초상권 등을 침해하는 내용
   - 범죄행위와 관련된 내용
3. 회원이 공개로 설정한 게시물은 서비스 내 지역 공유 지도, 추천 콘텐츠 등에 노출될 수 있으며, 회사는 이를 서비스 운영 및 홍보 목적으로 활용할 수 있습니다.

제6조 (저작권 및 초상권)
1. 회원이 업로드하는 사진 및 콘텐츠는 본인이 직접 촬영하거나 적법하게 권리를 보유한 것이어야 합니다.
2. 타인의 얼굴이 식별 가능한 사진을 게시할 경우, 해당 인물의 사전 동의를 받아야 합니다.
3. 저작권 및 초상권 침해로 인한 법적 분쟁이 발생할 경우, 모든 책임은 게시자에게 있습니다.

제7조 (서비스 제공의 중단)
1. 회사는 시스템 점검, 서버 증설 등의 사유로 서비스 제공을 일시 중단할 수 있습니다.
2. 천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우 서비스를 중단할 수 있습니다.

제8조 (면책)
1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
2. 회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여 책임지지 않습니다.
3. 회사는 회원이 게시한 정보, 자료의 신뢰도 및 정확성에 대해 책임지지 않습니다.

제9조 (분쟁 해결)
1. 본 약관은 대한민국 법령에 따라 규율되고 해석됩니다.
2. 서비스 이용과 관련하여 회사와 회원 간 발생한 분쟁에 대해서는 민사소송법상의 관할법원에 소를 제기할 수 있습니다.

[부칙]
본 약관은 2025년 1월 1일부터 시행됩니다.
`;

  return (
    <div className="flex flex-col items-start justify-start min-h-screen bg-white px-[29px] pt-[120px] relative">
      {/* 뒤로가기 버튼 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[30px] w-[35px] h-[35px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/* 제목 */}
      <h1 className="text-[22px] font-semibold text-black mb-6">
        개인정보 처리방침 및 이용약관
      </h1>

      {/* 스크롤 가능한 약관 내용 박스 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-[332px] h-[468px] border border-gray-300 rounded-[8px] p-5 overflow-y-scroll text-[14px] text-gray-700 leading-relaxed whitespace-pre-line"
      >
        {policyText}
      </div>

      {/* 체크박스 영역 */}
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
          위 내용을 모두 확인하였으며, 개인정보 처리방침 및 이용약관에 동의합니다.
        </label>
      </div>

      {/* 버튼 영역 */}
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

      {/* 안내 문구 */}
      {!scrolledToBottom && (
        <p className="text-gray-400 text-[13px] mt-3 self-center">
          모든 내용을 끝까지 읽으면 체크 및 동의가 활성화됩니다.
        </p>
      )}
    </div>
  );
}
