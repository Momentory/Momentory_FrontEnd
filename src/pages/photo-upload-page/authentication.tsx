import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import LoaderIcon from '../../assets/loader.svg?react';

export default function AuthenticationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    'loading' | 'success' | 'error' | null
  >(null);

  // TODO: 실제 API에서 질문 정보 가져오기
  const question = '해당 위치 방문을 인증할까요?';
  const questionImage =
    location.state?.questionImage || location.state?.selectedImage;

  const parseQuestion = (q: string) => {
    const match = q.match(
      /^(.+?)(를|에|에서|이|가|을|를|와|과|로|으로)\s*(.+)$/
    );
    if (match) {
      return {
        keyword: match[1],
        particle: match[2],
        remainingText: match[3],
      };
    }
    return {
      keyword: q,
      particle: '',
      remainingText: '',
    };
  };

  const { keyword, particle, remainingText } = parseQuestion(question);

  const handleYes = () => {
    setShowModal(true);
    setAuthStatus('loading');

    setTimeout(() => {
      const success = Math.random() > 0.3;
      setAuthStatus(success ? 'success' : 'error');
    }, 2000);
  };

  const handleNo = () => {
    navigate('/home');
  };

  const handleCloseModal = () => {
    if (authStatus === 'success') {
      navigate('/stamp-acquisition', {
        state: {
          ...location.state,
          stampType: 'cultural',
          stampName: '광명동굴',
          stampImagePath: '/cultural-stamps/광명동굴.svg',
          points: 50,
        },
      });
    } else {
      setShowModal(false);
      setAuthStatus(null);
    }
  };

  const handleRetry = () => {
    setAuthStatus('loading');
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setAuthStatus(success ? 'success' : 'error');
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <div className="w-full max-w-sm">
        <h2 className="text-[29px] font-semibold text-left mb-15">
          <div>
            <span className="text-[#444444]">{keyword}</span>
            {particle && <span className="text-[#444444]">{particle}</span>}
          </div>
          {remainingText && (
            <div className="text-[#444444]">{remainingText}</div>
          )}
        </h2>

        {/* 질문 이미지 */}
        {questionImage && (
          <div className="mb-20 flex justify-center">
            <div className="w-60 h-60 bg-white border border-[#B3B3B3] overflow-hidden shadow-lg p-5">
              <img
                src={questionImage}
                alt="Question"
                className="w-full aspect-[194/166] object-cover"
              />
            </div>
          </div>
        )}

        {/* 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleYes}
            className="w-full py-4 px-6 rounded-[25px] bg-[#FF7070] text-white font-semibold text-lg hover:bg-[#ff6060] transition-colors cursor-pointer"
          >
            네, 인증할래요
          </button>
          <button
            onClick={handleNo}
            className="w-full py-4 px-6 rounded-[25px] bg-[#EAEAEA] text-[#8D8D8D] font-semibold text-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            다음에 할게요
          </button>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <Modal
          title={
            authStatus === 'loading'
              ? '인증 중'
              : authStatus === 'success'
                ? '인증 완료'
                : '인증 실패'
          }
          onClose={handleCloseModal}
        >
          {authStatus === 'loading' && (
            <div className="flex flex-col items-center pb-6">
              <div className="flex items-center justify-center">
                <LoaderIcon className="w-16 h-16" />
              </div>
            </div>
          )}

          {authStatus === 'success' && (
            <div className="flex flex-col items-center pb-6">
              <div className="w-17 h-17 bg-[#FF7070] rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className="text-[#7C7C7C] text-center">인증을 완료했어요!</p>
            </div>
          )}

          {authStatus === 'error' && (
            <div className="flex flex-col items-center pb-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
              <p className="text-gray-600 text-center mb-4">
                인증을 완료하지 못했어요.
              </p>
              <button
                onClick={handleRetry}
                className="w-full py-3 px-6 rounded-[25px] bg-[#FF7070] text-white font-semibold hover:bg-[#ff6060] transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
