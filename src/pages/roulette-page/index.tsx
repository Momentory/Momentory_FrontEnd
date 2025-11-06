import { useState } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import Modal from '../../components/common/Modal';
import bigRouletteImage from '../../assets/bigroulette.svg';
import star3 from '../../assets/star3.svg';
import star4 from '../../assets/star4.svg';
import star5 from '../../assets/star5.svg';
import star6 from '../../assets/star6.svg';
import star7 from '../../assets/star7.svg';
import star8 from '../../assets/star8.svg';

const regions = [
  { name: '수원시', color: '#B3E5FC' },
  { name: '용인시', color: '#FFF9C4' },
  { name: '부천시', color: '#C5E1A5' },
  { name: '시흥시', color: '#F8BBD0' },
  { name: '성남시', color: '#FFCCBC' },
  { name: '안산시', color: '#FFE0B2' },
  { name: '김포시', color: '#B3E5FC' },
  { name: '화성시', color: '#C5E1A5' },
];

const recentWinners = [
  { name: '고양시', icon: '🐾' },
  { name: '부천시', icon: '🌸' },
  { name: '용인시', icon: '🌳' },
  { name: '수원시', icon: '🍎' },
];

export default function RoulettePage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [finalRotation, setFinalRotation] = useState(0);
  const fixedRotationCount = 10;

  const handleSpin = () => {
    const rotation = 360 * fixedRotationCount + Math.random() * 360;

    setFinalRotation(0);

    requestAnimationFrame(() => {
      setIsSpinning(true);
      setFinalRotation(rotation);
    });

    setTimeout(() => {
      const normalizedAngle = ((rotation % 360) + 360) % 360;
      const pointerAngle = (270 - normalizedAngle + 360) % 360;

      let sectionIndex = 0;
      for (let i = 0; i < regions.length; i++) {
        const sectionCenterAngle = (i * anglePerRegion - 90 + 360) % 360;
        const halfAngle = anglePerRegion / 2;
        const sectionStartAngle = (sectionCenterAngle - halfAngle + 360) % 360;
        const sectionEndAngle = (sectionCenterAngle + halfAngle + 360) % 360;

        if (sectionStartAngle < sectionEndAngle) {
          if (
            pointerAngle >= sectionStartAngle &&
            pointerAngle < sectionEndAngle
          ) {
            sectionIndex = i;
            break;
          }
        } else {
          if (
            pointerAngle >= sectionStartAngle ||
            pointerAngle < sectionEndAngle
          ) {
            sectionIndex = i;
            break;
          }
        }
      }

      setWinner(regions[sectionIndex].name);
      setIsSpinning(false);
      setShowResult(true);
    }, 10000);
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  const anglePerRegion = 360 / regions.length;

  const stars = [
    { svg: star3, size: 90, top: '15%', left: '20%' },
    { svg: star4, size: 60, top: '20%', left: '70%' },
    { svg: star5, size: 50, top: '75%', left: '25%' },
    { svg: star6, size: 70, top: '70%', left: '45%' },
    { svg: star7, size: 40, top: '74%', left: '65%' },
    { svg: star8, size: 40, top: '25%', left: '55%' },
  ];

  return (
    <div className="min-h-screen bg-[#E7D1D1] relative overflow-hidden">
      <DropdownHeader title="룰렛" />

      <div className="pt-[40px] pb-6">
        <div
          className="bg-white rounded-3xl mb-12 mx-4"
          style={{
            boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="flex justify-center pt-7 pb-0">
            <div
              className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[35px] border-t-[#FF7070]"
              style={{
                filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))',
              }}
            ></div>
          </div>

          <div
            className="relative flex justify-center items-center"
            style={{
              width: '100%',
              padding: '10px',
              paddingTop: '0px',
              marginTop: '-50px',
              minHeight: '450px',
            }}
          >
            <div
              className="relative"
              style={{
                width: '450px',
                height: '450px',
                flexShrink: 0,
                transform: `rotate(${finalRotation}deg)`,
                transition: isSpinning
                  ? 'transform 10s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                  : 'none',
              }}
            >
              <img
                src={bigRouletteImage}
                alt="룰렛"
                style={{
                  width: '450px',
                  height: '450px',
                  objectFit: 'contain',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />

              {regions.map((region, index) => {
                const rotationAngle = index * anglePerRegion;
                const positionAngle = index * anglePerRegion - 90;
                const radian = positionAngle * (Math.PI / 180);
                const textRadius = 100;

                return (
                  <div
                    key={index}
                    className="absolute pointer-events-none z-10"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(${textRadius * Math.cos(radian)}px, ${textRadius * Math.sin(radian)}px) rotate(${rotationAngle}deg)`,
                      transformOrigin: '0 0',
                    }}
                  >
                    <div
                      className="text-base font-bold text-white whitespace-nowrap"
                      style={{
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {region.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-4 px-6 rounded-4xl font-bold text-white text-lg ${
                isSpinning
                  ? 'bg-[#EAEAEA]'
                  : 'bg-[#FF7070] hover:bg-[#ff6060] active:bg-[#ff5050] cursor-pointer'
              } transition-colors`}
            >
              ▶ 룰렛 돌리기
            </button>
          </div>
        </div>

        <div className="mb-6 mx-8">
          <h2 className="text-[27px] font-bold text-[#444444] mb-4">
            최근 당첨된 지역
          </h2>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-2 border-[#DCA7A7]">
            <div className="space-y-3">
              {recentWinners.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-4 rounded-lg w-full ${
                    index % 2 === 1 ? 'bg-[#FFEDED]' : ''
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[18px] font-bold text-[#000000]">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showResult &&
        stars.map((star, index) => (
          <div
            key={index}
            className="fixed pointer-events-none z-[501]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          >
            <img
              src={star.svg}
              alt="별"
              className="w-full h-full object-contain"
            />
          </div>
        ))}

      {showResult && winner && (
        <Modal title="결과 확인" onClose={handleCloseResult}>
          <div className="w-full flex flex-col items-center">
            <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400">이미지</span>
            </div>
            <p className="text-center text-base font-medium text-gray-800 mb-6">
              <span className="font-bold" style={{ color: '#B66262' }}>
                [{winner}]
              </span>{' '}
              지역이 당첨되었습니다!
            </p>
            <button
              onClick={handleCloseResult}
              className="w-full py-3 px-6 rounded-xl bg-[#FF7070] text-white font-bold text-base hover:bg-[#ff6060] active:bg-[#ff5050] transition-colors"
            >
              확인
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
