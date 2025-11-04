import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DropdownHeader from '../../components/common/DropdownHeader';
import Star from '../../assets/icons/rouletteStar.svg?react';
import Modal from '../../components/common/Modal';
import StartIcon from '../../assets/icons/rouletteStart.svg'

interface StarData {
  id: number;
  left: string;
  top: string;
  width: string;
  height: string;
  color: string;
  y2: number;
  y3: number;
  x2: number;
  x3: number;
  initialRotate: number;
  animateRotate: number;
  duration: number;
  delay: number;
}

const cities = [
  '수원시', '용인시', '부천시', '시흥시', '성남시', '안산시', '김포시', '화성시',
];
const cityColors = [
  { bg: '#E4F1FE', text: '#546A7B' }, // 수원시
  { bg: '#FFF5E1', text: '#8C6D3C' }, // 용인시
  { bg: '#FFE4E1', text: '#A56767' }, // 부천시
  { bg: '#E2F0D9', text: '#6B8E23' }, // 시흥시
  { bg: '#FDEDE2', text: '#C17B58' }, // 성남시
  { bg: '#E6E6FA', text: '#6A5ACD' }, // 안산시
  { bg: '#D4F1F4', text: '#4682B4' }, // 김포시
  { bg: '#FFF0F5', text: '#DB7093' }, // 화성시
];

const starColors = [
  '#FFAE00', '#FF9880', '#FFD900', '#5EFFF4', '#FF5EDC', '#6DFF50',
];

const RoulettePage = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [stars, setStars] = useState<StarData[]>([]);
  const [modalCity, setModalCity] = useState<string | null>(null);
  const cityEmoji = "🏖️";

  useEffect(() => {
    if (selectedCity) {
      setModalCity(selectedCity);
    }
  }, [selectedCity]);

  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * cities.length);
    const degreePerCity = 360 / cities.length;
    const currentAngle = rotation % 360;
    const targetSliceCenter = 360 - (randomIndex * degreePerCity + degreePerCity / 2);
    const distance = (targetSliceCenter - currentAngle + 360) % 360;
    const randomOffset = (Math.random() - 0.5) * (degreePerCity * 0.4);
    const newRotation = rotation + (360 * 5) + distance + randomOffset;
    
    setRotation(newRotation);
    setTimeout(() => {
      const result = cities[randomIndex];

      const newStars = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        left: `${50 + (Math.random() - 0.5) * 140}%`,
        top: `${50 + (Math.random() - 0.5) * 140}%`,
        width: `${25 + Math.random() * 25}px`,
        height: `${25 + Math.random() * 25}px`,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        y2: (Math.random() - 0.5) * 150,
        y3: (Math.random() - 0.5) * 250,
        x2: (Math.random() - 0.5) * 150,
        x3: (Math.random() - 0.5) * 250,
        initialRotate: Math.random() * 360,
        animateRotate: Math.random() * 360 + 720,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 0.5,
      }));
      setStars(newStars);

      setSelectedCity(result);
      setRecentCities((prev) => [result, ...prev].slice(0, 4));
      setIsSpinning(false);
    }, 4500);
  };

  const closeModal = () => {
    setSelectedCity(null);
    setStars([]);
  };

  const conicGradient = `conic-gradient(${cityColors
    .map((c, i) => `${c.bg} ${i * 45}deg ${(i + 1) * 45}deg`)
    .join(', ')})`;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#E7D1D1] text-[#444444]">
      <DropdownHeader title="룰렛" />

      <main className="flex flex-col items-center p-6 mt-16 w-full max-w-md">
        <div className="mt-20 bg-white w-full rounded-3xl p-6 shadow-lg shadow-rose-100/50 mb-8">
          <div className="relative w-full aspect-square mb-8">
            <motion.div
              className="absolute inset-0 rounded-full border-8 border-white"
              style={{ background: conicGradient }}
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: 'easeOut' }}
            >
              {cities.map((city, i) => (
                <div
                  key={city}
                  className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center"
                  style={{ transform: `rotate(${i * 45}deg) translateY(-30%)` }}
                >
                  <span
                    style={{
                      transform: `rotate(112.5deg)`,
                      color: cityColors[i].text,
                    }}
                    className="font-bold text-base sm:text-lg"
                  >
                    {city}
                  </span>
                </div>
              ))}
            </motion.div>
            <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[18px] border-r-[18px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500" />
          </div>
          <button
            onClick={spinRoulette}
            disabled={isSpinning}
            className="w-full bg-[#FF7070] text-white py-4 rounded-3xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <img src={StartIcon} className="w-4 h-4"/>
            룰렛 돌리기
          </button>
        </div>
        <h2 className="font-extrabold text-2xl mb-4 self-start tracking-wide">
          최근 당첨된 지역
        </h2>
        <div className="w-full bg-white rounded-[20px] border-2 border-[#DCA7A7] p-2">
          <ul>
            {recentCities.length > 0 ? (
              recentCities.map((city, i) => (
                <li
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-xl text-lg font-bold gap-3
                    ${i % 2 === 0 ? 'bg-white' : 'bg-[#FFEDED]'}`}
                >
                  <p>{cityEmoji} <span className="text-black">{city}</span></p>
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                아직 당첨 기록이 없습니다.
              </p>
            )}
          </ul>
        </div>
      </main>

      <>
        {selectedCity && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 max-w-xs mx-auto flex items-center justify-center pointer-events-none">
              {stars.map((star) => (
                <motion.div
                  key={star.id}
                  className="absolute"
                  style={{
                    left: star.left, top: star.top, width: star.width, height: star.height, color: star.color,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1, 0], y: [0, star.y2, star.y3], x: [0, star.x2, star.x3], rotate: [star.initialRotate, star.animateRotate] }}
                  transition={{ duration: star.duration, ease: 'easeOut', delay: star.delay }}
                >
                  <Star className="w-full h-full" />
                </motion.div>
              ))}
            </div>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                exit={{ scale: 0.8, opacity: 0 }}
            >
                <Modal title="결과 확인" onClose={closeModal}>
                    <div className="w-full flex flex-col items-center p-5 gap-3">
                    <img
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                        alt="지역 이미지"
                        className="w-full h-48 object-cover rounded-2xl"
                    />
                    <p className="text-center text-base font-bold leading-5 tracking-wide">
                        <span className="text-[#B56161]">[{modalCity}]</span> 지역이
                        당첨되었습니다!
                    </p>
                    <button
                        onClick={closeModal}
                        className="w-full bg-[#FF7070] text-white py-2 rounded-lg font-bold text-xs leading-5 tracking-wide cursor-pointer"
                    >
                        확인
                    </button>
                    </div>
                </Modal>
            </motion.div>
          </motion.div>
        )}
      </>
    </div>
  );
};

export default RoulettePage;