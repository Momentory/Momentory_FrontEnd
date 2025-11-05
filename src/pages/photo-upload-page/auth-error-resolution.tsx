import { useNavigate } from 'react-router-dom';
import AuthErrorImage from '../../assets/autherror.svg';

export default function AuthErrorResolutionPage() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-[25px] font-bold text-center mb-15 text-[#444444]">
          인증 오류 해결하기
        </h1>

        <div className="mb-10 flex justify-center">
          <img
            src={AuthErrorImage}
            alt="인증 오류 해결"
            className="w-full max-w-[256px] h-auto"
          />
        </div>

        <div className="mb-10">
          <p className="text-[#4C4C4C] text-base leading-relaxed text-left">
            만약 실제로 방문했는데 인증이
            <br />
            실패했을 경우 해당 인증 사진, 인증 시간과
            <br />
            함께{' '}
            <span className="text-[#2B8EDF] font-semibold">
              Momentory@gmail.com
            </span>{' '}
            으로
            <br />
            이메일 전송 부탁드립니다.
          </p>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-[25px] bg-[#FF7070] text-white font-semibold text-lg hover:bg-[#ff6060] transition-colors cursor-pointer"
        >
          확인
        </button>
      </div>
    </div>
  );
}
