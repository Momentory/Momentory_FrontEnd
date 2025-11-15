import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stampEx from '../../assets/stampEx.svg';
import 고양킨텍스 from '../../assets/stamp/고양킨텍스.png';
import 서울대공원 from '../../assets/stamp/과천서울대공원.png';
import 광명동굴 from '../../assets/stamp/광명동굴.png';
import 한강유채꽃 from '../../assets/stamp/구리시한강유채꽃.png';
import 물의정원 from '../../assets/stamp/남양주시물의정원.png';
import 동두천계곡 from '../../assets/stamp/동두천계곡.png';
import 만화박물관 from '../../assets/stamp/부천만화박물관.png';
import 남한선성 from '../../assets/stamp/성남남한산성.png';
import 수원화성 from '../../assets/stamp/수원화성.png';
import 안산누에섬 from '../../assets/stamp/안산누에섬.png';
import 안양천 from '../../assets/stamp/안양천.png';
import 오산독산성 from '../../assets/stamp/오산독산성.png';
import 평택항 from '../../assets/stamp/평택항.png';
import 행복로 from '../../assets/stamp/행복로.png';

export default function CultureStampContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'culture' | 'region'>('culture');
  const [clickedBoxes, setClickedBoxes] = useState<Set<number>>(new Set());

  const handleTabClick = (tab: 'culture' | 'region', path: string) => {
    setActiveTab(tab);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleBoxClick = (index: number) => {
    // 빈칸(14번 이후)은 클릭해도 반응 없음
    if (index >= 14) return;

    setClickedBoxes((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  const cultureNames = [
    '고양킨텍스',
    '서울대공원',
    '광명동굴',
    '한강유채꽃',
    '물의정원',
    '동두천계곡',
    '만화박물관',
    '남한선성',
    '수원화성',
    '안산누에섬',
    '안양천',
    '오산독산성',
    '평택항',
    '행복로',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
    '빈칸',
  ];

  const cultureImages: { [key: string]: string } = {
    고양킨텍스: 고양킨텍스,
    서울대공원: 서울대공원,
    광명동굴: 광명동굴,
    한강유채꽃: 한강유채꽃,
    물의정원: 물의정원,
    동두천계곡: 동두천계곡,
    만화박물관: 만화박물관,
    남한선성: 남한선성,
    수원화성: 수원화성,
    안산누에섬: 안산누에섬,
    안양천: 안양천,
    오산독산성: 오산독산성,
    평택항: 평택항,
    행복로: 행복로,
  };

  const getStampImage = (index: number) => {
    const name = cultureNames[index];
    return name === '빈칸' ? stampEx : cultureImages[name];
  };

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen pb-20 pt-3 relative z-50">
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
                  {cultureNames[index]}
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
                  {cultureNames[index]}
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
                        index === 10
                          ? 'w-[108px] h-[88px]'
                          : 'w-[68px] h-[68px]'
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
                  {cultureNames[index]}
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
                  {cultureNames[index]}
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
                  {cultureNames[index]}
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
                  {cultureNames[index]}
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
                  {cultureNames[index]}
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
                  {cultureNames[index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
