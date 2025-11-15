import { useState, useEffect } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import Modal from '../../components/common/Modal';
import bigRouletteImage from '../../assets/bigroulette.svg';
import star3 from '../../assets/star3.svg';
import star4 from '../../assets/star4.svg';
import star5 from '../../assets/star5.svg';
import star6 from '../../assets/star6.svg';
import star7 from '../../assets/star7.svg';
import star8 from '../../assets/star8.svg';
import giftIcon from '../../assets/giftIcon.svg';
import successIcon from '../../assets/success.svg';
import failIcon from '../../assets/fail.svg';
import ongoingIcon from '../../assets/ongoing.svg';
import {
  getRouletteSlots,
  spinRoulette,
  getRouletteHistory,
} from '../../api/roulette';
import type { RouletteSlot, RouletteHistoryItem } from '../../types/roulette';

export default function RoulettePage() {
  const [slots, setSlots] = useState<RouletteSlot[]>([]);
  const [recentWinners, setRecentWinners] = useState<RouletteHistoryItem[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerImageUrl, setWinnerImageUrl] = useState<string | null>(null);
  const [finalRotation, setFinalRotation] = useState(0);
  const [remainingPoint, setRemainingPoint] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<string | null>(null);
  const fixedRotationCount = 10;

  // 슬롯 데이터 가져오기
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await getRouletteSlots();
        setSlots(data.slots);
      } catch (error) {
        console.error('슬롯 조회 실패:', error);
      }
    };

    const fetchHistory = async () => {
      try {
        const data = await getRouletteHistory();
        // 최근 4개만 가져오기
        const recent = data.roulettes.slice(0, 4);
        setRecentWinners(recent);
      } catch (error) {
        console.error('히스토리 조회 실패:', error);
      }
    };

    fetchSlots();
    fetchHistory();
  }, []);

  const handleSpin = async () => {
    if (slots.length === 0) {
      alert('슬롯을 불러오는 중입니다.');
      return;
    }

    const rotation = 360 * fixedRotationCount + Math.random() * 360;

    setFinalRotation(0);

    requestAnimationFrame(() => {
      setIsSpinning(true);
      setFinalRotation(rotation);
    });

    setTimeout(async () => {
      const normalizedAngle = ((rotation % 360) + 360) % 360;
      const pointerAngle = (270 - normalizedAngle + 360) % 360;

      let sectionIndex = 0;
      for (let i = 0; i < slots.length; i++) {
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

      const selectedSlot = slots[sectionIndex];

      try {
        // API 호출
        const result = await spinRoulette({
          type: selectedSlot.type,
          selectedName: selectedSlot.name,
          itemId: selectedSlot.itemId,
        });

        setWinner(result.reward);
        setWinnerImageUrl(selectedSlot.imageUrl);
        setRemainingPoint(result.remainingPoint);
        setDeadline(result.deadline);
        setIsSpinning(false);
        setShowResult(true);

        // 히스토리 갱신
        const historyData = await getRouletteHistory();
        const recent = historyData.roulettes.slice(0, 4);
        setRecentWinners(recent);
      } catch (error: any) {
        console.error('룰렛 스핀 실패:', error);
        setIsSpinning(false);
        if (error.response?.data?.message) {
          alert(`룰렛 실패: ${error.response.data.message}`);
        } else {
          alert('룰렛을 돌리는데 실패했습니다.');
        }
      }
    }, 4000);
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  const anglePerRegion = 360 / (slots.length || 8);

  const stars = [
    { svg: star3, size: 90, top: '15%', left: '20%' },
    { svg: star4, size: 60, top: '20%', left: '70%' },
    { svg: star5, size: 50, top: '75%', left: '25%' },
    { svg: star6, size: 70, top: '70%', left: '45%' },
    { svg: star7, size: 40, top: '74%', left: '65%' },
    { svg: star8, size: 40, top: '25%', left: '55%' },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <DropdownHeader title="룰렛" />

      <div className="pt-[40px] pb-20">
        <div
          className="bg-white rounded-3xl mb-12 mx-[25px] border-[3px] border-[#DFD5D5]"
          style={{
            boxShadow: '4px 4px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="flex justify-center pt-7 pb-0 mb-[5px]">
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
              padding: '0px',
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
                  ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                  : 'none',
              }}
            >
              <img
                src={bigRouletteImage}
                alt="룰렛"
                style={{
                  width: '410px',
                  height: '410px',
                  objectFit: 'contain',
                  display: 'block',
                  position: 'absolute',
                  top: '5px',
                  left: '22.6px',
                }}
              />

              {slots.map((slot, index) => {
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
                      {slot.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 pb-6 -mt-6">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-4 px-6 rounded-[25px] font-bold text-white text-lg ${
                isSpinning
                  ? 'bg-[#EAEAEA]'
                  : 'bg-[#FF7070] hover:bg-[#ff6060] active:bg-[#ff5050] cursor-pointer'
              } transition-colors`}
            >
              ▶&nbsp;&nbsp;룰렛 돌리기
            </button>
          </div>
        </div>

        <div className="mb-6 mx-8">
          <h2 className="text-[27px] font-bold text-[#444444] mb-4">
            최근 당첨된 지역
          </h2>
          <div
            style={{
              width: '330px',
              height: '470px',
              flexShrink: 0,
              borderRadius: '5px',
              border: '2px solid #D2B3B3',
              background: '#FFF',
              zIndex: 10,
            }}
            className="shadow-md"
          >
            <div className="flex flex-col gap-[10px] items-center">
              {[1, 2, 3, 4].map((item) => {
                const boxData = {
                  1: { city: '하남시', icon: successIcon },
                  2: { city: '수원시', icon: failIcon },
                  3: { city: '고양시', icon: ongoingIcon },
                  4: { city: '김포시', icon: successIcon },
                }[item];

                return (
                  <div
                    key={item}
                    style={{
                      width: '325px',
                      height: '109px',
                      flexShrink: 0,
                      borderRadius: '5px',
                      background: item === 1 || item === 3 ? '#FFF' : '#F9EDED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingLeft: '23px',
                        paddingRight: '23px',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <img src={giftIcon} alt="gift" />
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span
                            style={{
                              fontFamily: 'NanumSquareRound',
                              fontSize: '21px',
                              fontStyle: 'normal',
                              fontWeight: 700,
                            }}
                          >
                            {boxData?.city}
                          </span>
                          <span
                            style={{
                              color: '#686868',
                              fontFamily: 'NanumSquareRound',
                              fontSize: '13px',
                              fontStyle: 'normal',
                              fontWeight: 700,
                              lineHeight: 'normal',
                              letterSpacing: '0.39px',
                            }}
                          >
                            마감: 2025년 11월 15일
                          </span>
                        </div>
                      </div>
                      <img src={boxData?.icon} alt="status" />
                    </div>
                  </div>
                );
              })}
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
            {winnerImageUrl && (
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={winnerImageUrl}
                  alt={winner}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-center text-base font-medium text-gray-800 mb-2">
              <span className="font-bold" style={{ color: '#B66262' }}>
                [{winner}]
              </span>{' '}
              당첨되었습니다!
            </p>
            {remainingPoint !== null && (
              <p className="text-center text-sm text-gray-600 mb-2">
                남은 포인트: {remainingPoint}P
              </p>
            )}
            {deadline && (
              <p className="text-center text-sm text-gray-600 mb-4">
                인증 기한: {new Date(deadline).toLocaleDateString('ko-KR')}
              </p>
            )}
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
