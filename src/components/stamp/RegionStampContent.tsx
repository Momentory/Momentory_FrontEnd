import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stampEx from '../../assets/stampEx.svg';

export default function RegionStampContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'culture' | 'region'>('region');
  const [clickedBox, setClickedBox] = useState<number | null>(null);

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen pt-[33px]">
      {/* 상단바 - 기존 헤더 아래에 표시 */}
      <div className="relative flex items-center justify-center px-5 py-4 bg-white border-b border-gray-300">
        {/* 뒤로가기 버튼 */}
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] top-[50%] -translate-y-1/2 w-[30px] h-[30px] cursor-pointer"
          onClick={() => navigate(-1)}
        />

        {/* 타이틀 */}
        <h1 className="text-[25px] font-semibold text-gray-800">컬렉션</h1>
      </div>

      {/* 선택 영역 */}
      <div>
        <div className="flex border-b-2 border-gray-300 relative">
          <div
            className="flex-1 p-4 bg-white rounded-lg flex items-center justify-center relative cursor-pointer"
            onClick={() => {
              setActiveTab('culture');
              navigate('/stamp-collection/culture');
            }}
          >
            <h2 className="text-lg font-semibold">문화 스탬프</h2>
          </div>

          <div
            className="flex-1 p-4 bg-white rounded-lg flex items-center justify-center relative cursor-pointer"
            onClick={() => {
              setActiveTab('region');
              navigate('/stamp-collection/region');
            }}
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
                onClick={() => setClickedBox(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBox === index ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBox === index ? (
                    <img
                      src={stampEx}
                      alt="stamp"
                      className="w-[50px] h-[50px]"
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
                  className={`mt-2 text-sm text-gray-700 ${clickedBox === index ? 'visible' : 'invisible'}`}
                >
                  지역명
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
                onClick={() => setClickedBox(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBox === index ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBox === index ? (
                    <img
                      src={stampEx}
                      alt="stamp"
                      className="w-[50px] h-[50px]"
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
                  className={`mt-2 text-sm text-gray-700 ${clickedBox === index ? 'visible' : 'invisible'}`}
                >
                  지역명
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
                onClick={() => setClickedBox(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBox === index ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBox === index ? (
                    <img
                      src={stampEx}
                      alt="stamp"
                      className="w-[50px] h-[50px]"
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
                  className={`mt-2 text-sm text-gray-700 ${clickedBox === index ? 'visible' : 'invisible'}`}
                >
                  지역명
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
                onClick={() => setClickedBox(index)}
              >
                <div
                  className={`w-[75px] h-[75px] flex-shrink-0 bg-white border-2 rounded-[12px] flex items-center justify-center cursor-pointer ${clickedBox === index ? 'border-black' : 'border-gray-300'}`}
                >
                  {clickedBox === index ? (
                    <img
                      src={stampEx}
                      alt="stamp"
                      className="w-[50px] h-[50px]"
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
                  className={`mt-2 text-sm text-gray-700 ${clickedBox === index ? 'visible' : 'invisible'}`}
                >
                  지역명
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
                onClick={() => setClickedBox(index)}
              >
                <div className="w-[75px] h-[75px] flex-shrink-0 bg-white border-2 border-gray-300 rounded-[12px] flex items-center justify-center cursor-pointer">
                  {clickedBox === index ? (
                    <img
                      src={stampEx}
                      alt="stamp"
                      className="w-[50px] h-[50px]"
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
                  className={`mt-2 text-sm text-gray-700 ${clickedBox === index ? 'visible' : 'invisible'}`}
                >
                  지역명
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
                onClick={() => setClickedBox(index)}
              >
                <div className="w-[75px] h-[75px] flex-shrink-0 bg-white border-2 border-gray-300 rounded-[12px] flex items-center justify-center cursor-pointer">
                  {clickedBox === index ? (
                    <img
                      src={stampEx}
                      alt="stamp"
                      className="w-[50px] h-[50px]"
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
                  className={`mt-2 text-sm text-gray-700 ${clickedBox === index ? 'visible' : 'invisible'}`}
                >
                  지역명
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
                onClick={() => setClickedBox(index)}
              >
                <div className="w-[75px] h-[75px] flex-shrink-0 bg-white border-2 border-gray-300 rounded-[12px] flex items-center justify-center cursor-pointer">
                  {clickedBox === index ? (
                    <img
                      src={stampEx}
                      alt="stamp"
                      className="w-[50px] h-[50px]"
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
                  className={`mt-2 text-sm text-gray-700 ${clickedBox === index ? 'visible' : 'invisible'}`}
                >
                  지역명
                </p>
              </div>
            ))}
          </div>

          {/* 여덟 번째 행 (마지막 - 3개만) */}
          <div className="flex gap-[18px] justify-start mb-20">
            {[28, 29, 30].map((index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => setClickedBox(index)}
              >
                <div className="w-[75px] h-[75px] flex-shrink-0 bg-white border-2 border-gray-300 rounded-[12px] flex items-center justify-center cursor-pointer">
                  {clickedBox === index ? (
                    <img
                      src={stampEx}
                      alt="stamp"
                      className="w-[50px] h-[50px]"
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
                  className={`mt-2 text-sm text-gray-700 ${clickedBox === index ? 'visible' : 'invisible'}`}
                >
                  지역명
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
