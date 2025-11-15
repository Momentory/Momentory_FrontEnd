import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyStamps } from '../../api/stamp';
import 광주 from '../../assets/stamp/regional/광주.png';
import 김포 from '../../assets/stamp/regional/김포.png';
import 시흥 from '../../assets/stamp/regional/시흥.png';
import 안성 from '../../assets/stamp/regional/안성.png';
import 연천 from '../../assets/stamp/regional/연천.png';
import 의정부 from '../../assets/stamp/regional/의정부.png';
import 파주 from '../../assets/stamp/regional/파주.png';
import 가평 from '../../assets/stamp/regional/가평.png';
import 고양 from '../../assets/stamp/regional/고양.png';
import 과천 from '../../assets/stamp/regional/과천.png';
import 광명 from '../../assets/stamp/regional/광명.png';
import 구리 from '../../assets/stamp/regional/구리.png';
import 군포 from '../../assets/stamp/regional/군포.png';
import 남양주 from '../../assets/stamp/regional/남양주.png';
import 동두천 from '../../assets/stamp/regional/동두천.png';
import 부천 from '../../assets/stamp/regional/부천.png';
import 성남 from '../../assets/stamp/regional/성남.png';
import 수원 from '../../assets/stamp/regional/수원.png';
import 안산 from '../../assets/stamp/regional/안산.png';
import 안양 from '../../assets/stamp/regional/안양.png';
import 양주 from '../../assets/stamp/regional/양주.png';
import 양평군 from '../../assets/stamp/regional/양평군.png';
import 여주 from '../../assets/stamp/regional/여주.png';
import 오산 from '../../assets/stamp/regional/오산.png';
import 용인 from '../../assets/stamp/regional/용인.png';
import 의왕 from '../../assets/stamp/regional/의왕.png';
import 이천 from '../../assets/stamp/regional/이천.png';
import 평택 from '../../assets/stamp/regional/평택.png';
import 포천 from '../../assets/stamp/regional/포천.png';
import 하남 from '../../assets/stamp/regional/하남.png';
import 화성 from '../../assets/stamp/regional/화성.png';

export default function RegionStampContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'culture' | 'region'>('region');
  const [clickedBoxes, setClickedBoxes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const regionNames = [
    '광주',
    '김포',
    '시흥',
    '안성',
    '연천',
    '의정부',
    '파주',
    '가평',
    '고양',
    '과천',
    '광명',
    '구리',
    '군포',
    '남양주',
    '동두천',
    '부천',
    '성남',
    '수원',
    '안산',
    '안양',
    '양주',
    '양평군',
    '여주',
    '오산',
    '용인',
    '의왕',
    '이천',
    '평택',
    '포천',
    '하남',
    '화성',
  ];

  // API에서 내 스탬프 데이터 가져오기
  useEffect(() => {
    const fetchMyStamps = async () => {
      try {
        setIsLoading(true);
        const response = await getMyStamps('REGIONAL');
        if (response.isSuccess && response.result) {
          const ownedRegions = new Set<number>();
          response.result.forEach((stamp) => {
            // "동두천시" -> "동두천" 변환 (시, 군 제거)
            const regionName = stamp.region.replace(/(시|군)$/, '');
            const index = regionNames.indexOf(regionName);
            if (index !== -1) {
              ownedRegions.add(index);
            }
          });
          setClickedBoxes(ownedRegions);
        }
      } catch (error) {
        console.error('스탬프 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyStamps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (tab: 'culture' | 'region', path: string) => {
    setActiveTab(tab);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleBoxClick = (index: number) => {
    // 보유한 스탬프만 클릭 가능
    // 클릭 시 효과는 없고 이미 획득한 것만 표시
  };

  const regionImages: { [key: string]: string } = {
    광주: 광주,
    김포: 김포,
    시흥: 시흥,
    안성: 안성,
    연천: 연천,
    의정부: 의정부,
    파주: 파주,
    가평: 가평,
    고양: 고양,
    과천: 과천,
    광명: 광명,
    구리: 구리,
    군포: 군포,
    남양주: 남양주,
    동두천: 동두천,
    부천: 부천,
    성남: 성남,
    수원: 수원,
    안산: 안산,
    안양: 안양,
    양주: 양주,
    양평군: 양평군,
    여주: 여주,
    오산: 오산,
    용인: 용인,
    의왕: 의왕,
    이천: 이천,
    평택: 평택,
    포천: 포천,
    하남: 하남,
    화성: 화성,
  };

  const getStampImage = (index: number) => {
    const name = regionNames[index];
    return regionImages[name];
  };

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white pt-3 relative z-50">
      {/* 선택 영역 */}
      <div>
        <div className="flex border-b-2 border-gray-300 relative">
          <div
            className="flex-1 p-4 bg-white rounded-lg flex items-center justify-center relative cursor-pointer"
            onClick={() =>
              handleTabClick('culture', '/stamp-collection/culture')
            }
          >
            <h2 className="text-lg font-semibold">문화 스탬프</h2>
          </div>

          <div
            className="flex-1 p-4 bg-white rounded-lg flex items-center justify-center relative cursor-pointer"
            onClick={() => handleTabClick('region', '/stamp-collection/region')}
          >
            <h2 className="text-lg font-semibold">지역 스탬프</h2>
          </div>

          {/* 이동하는 빨간 선 */}
          <div
            className={`absolute bottom-[-2px] w-[195px] h-[3px] bg-[#FF7070] z-10 transition-all duration-300 ease-in-out ${
              activeTab === 'culture'
                ? 'left-[25%] -translate-x-1/2'
                : 'left-[75%] -translate-x-1/2'
            }`}
          ></div>
        </div>
      </div>

      {/* Content 영역 */}
      <div className="p-5 pt-[30px]">
        <div className="flex flex-col gap-[18px]">
          {/* 첫 번째 행 */}
          <div className="flex gap-[18px] justify-center">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleBoxClick(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBoxes.has(index) ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBoxes.has(index) ? (
                    <img
                      src={getStampImage(index)}
                      alt="stamp"
                      className="w-[68px] h-[68px]"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="27"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm text-gray-700 ${clickedBoxes.has(index) ? 'visible' : 'invisible'}`}
                >
                  {regionNames[index]}
                </p>
              </div>
            ))}
          </div>

          {/* 두 번째 행 */}
          <div className="flex gap-[18px] justify-center">
            {[4, 5, 6, 7].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleBoxClick(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBoxes.has(index) ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBoxes.has(index) ? (
                    <img
                      src={getStampImage(index)}
                      alt="stamp"
                      className="w-[68px] h-[68px]"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="27"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm text-gray-700 ${clickedBoxes.has(index) ? 'visible' : 'invisible'}`}
                >
                  {regionNames[index]}
                </p>
              </div>
            ))}
          </div>

          {/* 세 번째 행 */}
          <div className="flex gap-[18px] justify-center">
            {[8, 9, 10, 11].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleBoxClick(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBoxes.has(index) ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBoxes.has(index) ? (
                    <img
                      src={getStampImage(index)}
                      alt="stamp"
                      className={
                        index === 8 ? 'w-[48px] h-[68px]' : 'w-[68px] h-[68px]'
                      }
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="27"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm text-gray-700 ${clickedBoxes.has(index) ? 'visible' : 'invisible'}`}
                >
                  {regionNames[index]}
                </p>
              </div>
            ))}
          </div>

          {/* 네 번째 행 */}
          <div className="flex gap-[18px] justify-center">
            {[12, 13, 14, 15].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleBoxClick(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBoxes.has(index) ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBoxes.has(index) ? (
                    <img
                      src={getStampImage(index)}
                      alt="stamp"
                      className="w-[68px] h-[68px]"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="27"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm text-gray-700 ${clickedBoxes.has(index) ? 'visible' : 'invisible'}`}
                >
                  {regionNames[index]}
                </p>
              </div>
            ))}
          </div>

          {/* 다섯 번째 행 */}
          <div className="flex gap-[18px] justify-center">
            {[16, 17, 18, 19].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleBoxClick(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBoxes.has(index) ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBoxes.has(index) ? (
                    <img
                      src={getStampImage(index)}
                      alt="stamp"
                      className="w-[68px] h-[68px]"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="27"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm text-gray-700 ${clickedBoxes.has(index) ? 'visible' : 'invisible'}`}
                >
                  {regionNames[index]}
                </p>
              </div>
            ))}
          </div>

          {/* 여섯 번째 행 */}
          <div className="flex gap-[18px] justify-center">
            {[20, 21, 22, 23].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleBoxClick(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBoxes.has(index) ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBoxes.has(index) ? (
                    <img
                      src={getStampImage(index)}
                      alt="stamp"
                      className="w-[68px] h-[68px]"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="27"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm text-gray-700 ${clickedBoxes.has(index) ? 'visible' : 'invisible'}`}
                >
                  {regionNames[index]}
                </p>
              </div>
            ))}
          </div>

          {/* 일곱 번째 행 */}
          <div className="flex gap-[18px] justify-center">
            {[24, 25, 26, 27].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleBoxClick(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBoxes.has(index) ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBoxes.has(index) ? (
                    <img
                      src={getStampImage(index)}
                      alt="stamp"
                      className="w-[68px] h-[68px]"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="27"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm text-gray-700 ${clickedBoxes.has(index) ? 'visible' : 'invisible'}`}
                >
                  {regionNames[index]}
                </p>
              </div>
            ))}
          </div>

          {/* 여덟 번째 행 (마지막 - 3개만) */}
          <div className="flex gap-[18px] justify-start">
            {[28, 29, 30].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => handleBoxClick(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBoxes.has(index) ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBoxes.has(index) ? (
                    <img
                      src={getStampImage(index)}
                      alt="stamp"
                      className="w-[68px] h-[68px]"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="27"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm text-gray-700 ${clickedBoxes.has(index) ? 'visible' : 'invisible'}`}
                >
                  {regionNames[index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
