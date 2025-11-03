import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen px-6 py-4 overflow-y-auto">
      {/* 상단바 */}
      <div className="relative flex items-center justify-center mb-4">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] w-[28px] h-[28px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[29px] font-semibold text-black-400">
          서비스약관
        </h1>
      </div>

      {/* 본문 */}
      <div className="pb-10 whitespace-pre-line leading-relaxed text-black-400 text-[12px] mt-15">
        <h2 className="text-[29px] font-bold mb-15">📜 개인정보 및 저작권 안내</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-[15px] font-semibold mb-1">📌 개인정보 처리방침</h3>
            <p>
              모멘토리는 회원가입 시 닉네임, 이메일, 생년월일 등 최소한의 정보만을 수집하며,
              서비스 제공 및 캐릭터 성장 시스템 운영을 위해서만 이용합니다.
              수집된 정보는 회원 탈퇴 후 30일 이내 자동 삭제되며, 제3자에게 제공되지 않습니다.
            </p>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold mb-1">📌 이용약관</h3>
            <p>
              사용자는 타인의 권리를 침해하지 않으며, 서비스 내 게시물(사진·메모 등)은
              본인의 창작물이어야 합니다. 공개로 설정된 콘텐츠는 비상업적 홍보(예: 지역 앨범,
              문화 지도)에 활용될 수 있습니다. 불법 촬영물 또는 타인의 얼굴이 포함된 무단 게시물은
              즉시 삭제 및 제재 대상이 됩니다.
            </p>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold mb-1">📌 저작권 및 초상권 안내</h3>
            <p>
              업로드한 사진의 저작권은 사용자 본인에게 있습니다.
              단, 공개 게시물은 모멘토리 내 ‘공유 지도’ 등에서 노출될 수 있습니다.
              타인의 초상이나 저작물을 포함할 경우, 이용자는 사전 동의를 받아야 하며,
              법적 분쟁 발생 시 모든 책임은 게시자에게 있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-[15px] font-semibold mb-1">📌 운영자 책임 및 신고 절차</h3>
            <p>
              서비스는 이용자가 게시한 콘텐츠의 법적 책임을 대리하지 않습니다.
              신고 접수 시 48시간 내 처리 결과를 통보하며,
              불법 콘텐츠는 즉시 삭제 조치됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
