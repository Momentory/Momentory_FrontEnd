import { useNavigate } from "react-router-dom";

export default function PrivacyDataPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen">
      {/* 상단바 */}
      <div className="relative flex items-center justify-center px-5 py-4 bg-white">
        {/* 뒤로가기 버튼 */}
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] top-[50%] -translate-y-1/2 w-[28px] h-[28px] cursor-pointer"
          onClick={() => navigate(-1)}
        />

        {/* 타이틀 */}
        <h1 className="text-[23px] font-semibold text-gray-800">
          개인정보 보호 및 데이터
        </h1>
      </div>

      {/* 본문 영역 */}
      <div className="px-6 mt-8 pb-10">
        {/* 제목 */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-[20px] font-bold text-black mb-2">
            사용자 데이터 보관 및 보안 안내
          </h2>
          <p className="text-[13px] text-gray-500">
            모멘토리 서비스의 개인정보 보호 정책
          </p>
        </div>

        {/* 본문 내용 */}
        <div className="space-y-6 text-gray-700 leading-relaxed">
          {/* 1. 데이터 보관 정책 */}
          <div>
            <h3 className="text-[16px] font-semibold text-black mb-3">
              1. 데이터 보관 정책
            </h3>
            <p className="text-[14px] mb-2">
              회원님의 개인정보는 다음과 같이 안전하게 보관됩니다.
            </p>
            <ul className="text-[13px] space-y-2 ml-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>수집항목: 이메일, 닉네임, 이름, 생년월일, 성별, 전화번호, 프로필 사진, 게시물(사진 및 텍스트)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>보관장소: AWS 서버 (서울 리전) - 암호화된 데이터베이스</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>보관기간: 회원 탈퇴 시까지 (단, 관계 법령에 따라 일정 기간 보존 필요 시 예외)</span>
              </li>
            </ul>
          </div>

          {/* 2. 보안 조치 */}
          <div>
            <h3 className="text-[16px] font-semibold text-black mb-3">
              2. 보안 조치
            </h3>
            <p className="text-[14px] mb-2">
              회사는 회원님의 개인정보를 안전하게 관리하기 위해 다음의 기술적·관리적 조치를 시행하고 있습니다.
            </p>
            <ul className="text-[13px] space-y-2 ml-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>비밀번호는 암호화(해시화)되어 저장되며, 회사도 원본 비밀번호를 확인할 수 없습니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>개인정보는 방화벽 및 SSL 인증서를 통해 전송 중 암호화됩니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>개인정보 접근 권한은 최소한의 관리자에게만 부여되며, 접근 기록이 관리됩니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>정기적인 보안 점검 및 취약점 분석을 실시합니다.</span>
              </li>
            </ul>
          </div>

          {/* 3. 회원 탈퇴 후 데이터 처리 */}
          <div>
            <h3 className="text-[16px] font-semibold text-black mb-3">
              3. 회원 탈퇴 후 데이터 처리
            </h3>
            <p className="text-[14px] mb-2">
              회원 탈퇴 시 개인정보는 다음과 같이 처리됩니다.
            </p>
            <ul className="text-[13px] space-y-2 ml-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>회원 탈퇴 요청 후 7일간 재가입을 위한 유예기간이 제공됩니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>7일 경과 후 모든 개인정보는 즉시 파기되며, 복구가 불가능합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>단, 전자상거래법 등 관련 법령에 따라 거래 기록 등 일부 정보는 법정 기간 동안 별도 보관될 수 있습니다.</span>
              </li>
            </ul>
          </div>

          {/* 4. 데이터 초기화 요청 방법 */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-[16px] font-semibold text-black mb-3">
              4. 데이터 초기화 요청 방법
            </h3>
            <p className="text-[14px] mb-3">
              회원 탈퇴를 하지 않더라도 계정 내 모든 데이터(게시물, 앨범, 활동 기록 등)의 초기화를 원하실 경우
              아래 이메일로 요청하실 수 있습니다.
            </p>
            <div className="bg-white p-4 rounded border border-gray-300 mb-3">
              <p className="text-[13px] text-gray-600 mb-1">문의 이메일</p>
              <p className="text-[16px] font-semibold text-[#FF7070]">
                momomentory@gmail.com
              </p>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              이메일 제목: [데이터 초기화 요청]<br />
              본문 포함 사항: 가입 이메일, 닉네임, 요청 사유<br />
              <br />
              접수된 요청은 순차적으로 처리되며, 영업일 기준 3~5일 이내 답변드립니다.
              데이터 초기화는 되돌릴 수 없으니 신중히 결정해 주시기 바랍니다.
            </p>
          </div>

          {/* 5. 개인정보 보호책임자 */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            <h3 className="text-[16px] font-semibold text-black mb-3">
              5. 개인정보 보호책임자
            </h3>
            <p className="text-[13px] text-gray-600">
              개인정보 처리 및 관련 문의사항은 위 이메일로 문의하시면
              성실히 답변드리겠습니다.
            </p>
            <p className="text-[12px] text-gray-500 mt-4">
              본 정책은 2025년 1월 1일부터 적용됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
