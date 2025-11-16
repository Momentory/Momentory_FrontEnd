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
        <h1 className="text-[25px] font-semibold text-gray-800">
          개인정보처리방침
        </h1>
      </div>

      {/* 본문 */}
      <div className="pb-10 whitespace-pre-line leading-relaxed text-gray-700 text-[13px] mt-10">
        <h2 className="text-[22px] font-bold mb-8 text-black">개인정보 처리방침</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-[16px] font-semibold mb-2 text-black">제1조 개인정보의 처리목적</h3>
            <p>
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
              이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <p className="mt-2">
              1. 회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지
            </p>
            <p>
              2. 서비스 제공: 콘텐츠 제공, 맞춤 서비스 제공, 본인인증
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제2조 개인정보의 처리 및 보유기간</h3>
            <p>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <p className="mt-2">
              1. 회원 가입 및 관리: 회원 탈퇴 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
            </p>
            <p className="ml-4">
              - 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지
            </p>
            <p className="mt-2">
              2. 전자상거래법에 따른 보관
            </p>
            <p className="ml-4">
              - 계약 또는 청약철회 등에 관한 기록: 5년
            </p>
            <p className="ml-4">
              - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제3조 정보주체의 권리·의무 및 행사방법</h3>
            <p>
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <p className="mt-2">
              1. 개인정보 열람요구
            </p>
            <p>
              2. 오류 등이 있을 경우 정정 요구
            </p>
            <p>
              3. 삭제요구
            </p>
            <p>
              4. 처리정지 요구
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제4조 개인정보의 파기</h3>
            <p>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <p className="mt-2">
              정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를
              계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제5조 개인정보 보호책임자</h3>
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
              아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-[12px] text-gray-500">
              본 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
