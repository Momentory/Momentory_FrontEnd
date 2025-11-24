import { useNavigate, useLocation } from 'react-router-dom';
import defaultImage from '../../assets/p-4.svg';
import { useCulturalStamp } from '../../hooks/stamp/useStampMutations';
import { mapCulturalSpotName } from '../../utils/stampUtils';

export default function QuestionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const question = location.state?.question || '경기 아트센터를 방문하셨나요?';
  // upload-complete.tsx에서 전달하는 이미지 우선 확인
  const questionImage =
    location.state?.questionImage ||
    location.state?.selectedImage ||
    location.state?.imageUrl ||
    location.state?.uploadedImage ||
    defaultImage;

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
  const rawSpotName = location.state?.nearbyPlace || keyword;
  const {
    canonicalName: culturalSpotName,
    stampDisplayName,
    isSupported: isSupportedSpot,
  } = mapCulturalSpotName(rawSpotName);

  const baseState = (location.state ?? {}) as Record<string, unknown>;

  const { mutate: issueCulturalStamp, isPending } = useCulturalStamp({
    onSuccess: (response) => {
      navigate('/authentication', {
        state: {
          ...baseState,
          question,
          questionImage,
          culturalStampResult: response.result,
          stampType: 'cultural',
          stampName: stampDisplayName,
        },
      });
    },
    onError: () => {
      alert('문화 스탬프 발급에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleYes = () => {
    if (!culturalSpotName || isPending) {
      alert('인증할 장소 정보를 찾지 못했어요. 다시 시도해주세요.');
      return;
    }

    issueCulturalStamp({ spotName: culturalSpotName });
  };

  const handleNo = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <div className="w-full max-w-sm">
        <h2 className="text-[29px] font-extrabold text-left mb-[80px]">
          <div>
            <span className="text-[#E43D3D]">{keyword}</span>
            {particle && <span className="text-[#444444]">{particle}</span>}
          </div>
          {remainingText && (
            <div className="text-[#444444]">{remainingText}</div>
          )}
        </h2>

        <div className="mb-20 flex justify-center">
          <div className="w-60 h-60 bg-white border-2 border-[#B3B3B3] overflow-hidden shadow-xl p-5">
            <img
              src={questionImage}
              alt="질문 사진"
              className="w-full aspect-194/166 object-cover"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleYes}
            disabled={isPending}
            className="w-full py-4 px-6 rounded-[25px] bg-[#FF7070] text-white font-semibold text-lg hover:bg-[#ff6060] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            네, 방문했어요
          </button>
          <button
            onClick={handleNo}
            className="w-full py-4 px-6 rounded-[25px] bg-[#EAEAEA] text-[#8D8D8D] font-semibold text-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            아니오, 방문하지 않았어요
          </button>
        </div>

        {/* 인증 실패 안내 텍스트 */}
        {location.state?.authFailed && (
          <div
            className="mt-4 text-center cursor-pointer"
            onClick={() => navigate('/auth-error-resolution')}
          >
            <span className="text-gray-400 text-sm">
              인증하는 데 문제가 발생하나요?
            </span>
            <span className="ml-1 text-gray-400">⚠️</span>
          </div>
        )}
      </div>
    </div>
  );
}
