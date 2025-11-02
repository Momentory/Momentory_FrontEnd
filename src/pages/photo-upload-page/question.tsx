import { useNavigate, useLocation } from 'react-router-dom';

export default function QuestionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: 실제 API에서 질문 정보 가져오기
  const question = location.state?.question || '경기 아트센터를 방문하셨나요?';
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
    navigate('/authentication', {
      state: {
        ...location.state,
        question,
        questionImage,
      },
    });
  };

  const handleNo = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <div className="w-full max-w-sm">
        <h2 className="text-[29px] font-semibold text-left mb-15">
          <div>
            <span className="text-[#E43D3D]">{keyword}</span>
            {particle && <span className="text-[#444444]">{particle}</span>}
          </div>
          {remainingText && (
            <div className="text-[#444444]">{remainingText}</div>
          )}
        </h2>

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

        <div className="space-y-3">
          <button
            onClick={handleYes}
            className="w-full py-4 px-6 rounded-[25px] bg-[#FF7070] text-white font-semibold text-lg hover:bg-[#ff6060] transition-colors cursor-pointer"
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
      </div>
    </div>
  );
}
