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
          className="absolute left-[10px] w-[28px] h-[28px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[29px] font-semibold text-black-400">
          서비스약관
        </h1>
      </div>

      {/* 본문 */}
      <div className="pb-10 whitespace-pre-line leading-relaxed text-gray-700 text-[13px] mt-10">
        <h2 className="text-[22px] font-bold mb-8 text-black">서비스 이용약관</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제1조 목적</h3>
            <p>
              본 약관은 모멘토리(이하 "회사")가 제공하는 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항,
              기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제2조 정의</h3>
            <p>
              1. "서비스"란 회사가 제공하는 모멘토리 및 관련 제반 서비스를 의미합니다.
            </p>
            <p>
              2. "회원"이란 본 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.
            </p>
            <p>
              3. "게시물"이란 회원이 서비스에 게시한 문자, 문서, 그림, 음성, 동영상 등 모든 정보를 말합니다.
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제3조 약관의 효력 및 변경</h3>
            <p>
              1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.
            </p>
            <p>
              2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 약관이 변경되는 경우
              회사는 변경사항을 시행일자 7일 전부터 서비스 내에 공지합니다.
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제4조 서비스의 제공 및 변경</h3>
            <p>
              1. 회사는 다음과 같은 서비스를 제공합니다.
            </p>
            <p className="ml-4">
              - 사진 업로드 및 앨범 관리 서비스
            </p>
            <p className="ml-4">
              - 커뮤니티 기능
            </p>
            <p className="ml-4">
              - 기타 회사가 정하는 서비스
            </p>
            <p className="mt-2">
              2. 회사는 상당한 이유가 있는 경우 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제5조 서비스의 중단</h3>
            <p>
              1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우 서비스 제공을 일시적으로 중단할 수 있습니다.
            </p>
            <p>
              2. 회사는 제1항의 사유로 서비스 제공이 일시적으로 중단됨으로 인하여 회원 또는 제3자가 입은 손해에 대하여 배상합니다.
              단, 회사에 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제6조 회원의 의무</h3>
            <p>
              1. 회원은 다음 행위를 하여서는 안 됩니다.
            </p>
            <p className="ml-4">
              - 신청 또는 변경 시 허위내용의 등록
            </p>
            <p className="ml-4">
              - 타인의 정보 도용
            </p>
            <p className="ml-4">
              - 회사가 게시한 정보의 변경
            </p>
            <p className="ml-4">
              - 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
            </p>
            <p className="ml-4">
              - 회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해
            </p>
            <p className="ml-4">
              - 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
            </p>
            <p className="ml-4">
              - 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제7조 게시물의 관리</h3>
            <p>
              1. 회원의 게시물이 정보통신망법 및 저작권법 등 관련법에 위반되는 내용을 포함하는 경우, 권리자는 관련법이 정한 절차에 따라
              해당 게시물의 게시중단 및 삭제 등을 요청할 수 있으며, 회사는 관련법에 따라 조치를 취하여야 합니다.
            </p>
            <p>
              2. 회사는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나 기타 회사 정책 및 관련법에
              위반되는 경우에는 관련법에 따라 해당 게시물에 대해 임시조치 등을 취할 수 있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-3 text-black">제8조 저작권의 귀속 및 이용제한</h3>
            <p>
              1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
            </p>
            <p>
              2. 회원은 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포,
              방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
            </p>
            <p>
              3. 회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-[12px] text-gray-500">
              본 약관은 2025년 1월 1일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
