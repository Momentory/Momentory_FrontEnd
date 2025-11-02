import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { extractRegionName, getStampImagePath } from '../../utils/stampUtils';

export default function StampAcquisitionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAnimation, setShowAnimation] = useState(false);

  // TODO: 실제 API에서 스탬프 정보 가져오기
  const stampType = location.state?.stampType || 'regional'; // 'regional' 또는 'cultural'
  const rawRegionName = location.state?.regionName || '하남시';
  const regionName = extractRegionName(rawRegionName);
  const points = location.state?.points || 50;
  const stampImagePath =
    location.state?.stampImagePath || getStampImagePath(regionName);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // 애니메이션 트리거
    setShowAnimation(true);
  }, []);

  const handleClick = () => {
    if (stampType === 'cultural') {
      // 문화 스탬프는 완료 후 추천 여행지 페이지로
      navigate('/recommended-places');
    } else {
      // 지역 스탬프는 질문 페이지로
      navigate('/question', {
        state: {
          ...location.state,
          regionName,
          points,
        },
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div
          className={`relative mb-8 transition-all duration-500 ${
            showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
        >
          {/* 스탬프 아이콘 */}
          <div className="w-[190px] h-[190px] bg-white rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden border border-[#D4D4D4]">
            {/* 스탬프 이미지 또는 기본 아이콘 */}
            {!imageError ? (
              <img
                src={stampImagePath}
                alt={`${regionName} 스탬프`}
                className="w-5/6 h-5/6 object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center justify-center gap-1">
                <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>
            )}
            {/* 체크마크 오버레이 */}
            <div className="absolute -bottom-0 -right-0 w-10 h-10 bg-[#FF7070] rounded-full flex items-center justify-center z-10">
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-[#FF7070] mb-3">
            {stampType === 'cultural'
              ? location.state?.stampName || regionName
              : regionName}
          </p>
          <p className="text-lg font-bold text-[#000000] mb-4">
            {stampType === 'cultural' ? '문화 스탬프 획득' : '지역 스탬프 획득'}
          </p>
          <div className="flex items-center justify-center gap-2">
            {/* 포인트 아이콘 */}
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold text-gray-800">+ {points}</span>
          </div>
        </div>
      </div>

      {/* 완료 버튼 (문화 스탬프만) */}
      {stampType === 'cultural' && (
        <div className="px-6 pb-8">
          <button
            onClick={handleClick}
            className="w-full py-4 px-6 rounded-[25px] bg-[#FF7070] text-white font-semibold text-lg hover:bg-[#ff6060] transition-colors"
          >
            완료
          </button>
        </div>
      )}
    </div>
  );
}
