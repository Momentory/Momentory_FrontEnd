import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Lock from '../../assets/icons/lockIcon.svg?react';
import { getMyStamps } from '../../api/stamp';
import type { RecentStampItem } from '../../types/stamp';

import 광주 from '../../assets/stamp/광주.png';
import 김포 from '../../assets/stamp/김포.png';
import 시흥 from '../../assets/stamp/시흥.png';
import 안성 from '../../assets/stamp/안성.png';
import 연천 from '../../assets/stamp/연천.png';
import 의정부 from '../../assets/stamp/의정부.png';
import 파주 from '../../assets/stamp/파주.png';
import 가평 from '../../assets/stamp/가평.png';
import 고양 from '../../assets/stamp/고양.png';
import 과천 from '../../assets/stamp/과천.png';
import 광명 from '../../assets/stamp/광명.png';
import 구리 from '../../assets/stamp/구리.png';
import 군포 from '../../assets/stamp/군포.png';
import 남양주 from '../../assets/stamp/남양주.png';
import 동두천 from '../../assets/stamp/동두천.png';
import 부천 from '../../assets/stamp/부천.png';
import 성남 from '../../assets/stamp/성남.png';
import 수원 from '../../assets/stamp/수원.png';
import 안산 from '../../assets/stamp/안산.png';
import 안양 from '../../assets/stamp/안양.png';
import 양주 from '../../assets/stamp/양주.png';
import 양평군 from '../../assets/stamp/양평군.png';
import 여주 from '../../assets/stamp/여주.png';
import 오산 from '../../assets/stamp/오산.png';
import 용인 from '../../assets/stamp/용인.png';
import 의왕 from '../../assets/stamp/의왕.png';
import 이천 from '../../assets/stamp/이천.png';
import 평택 from '../../assets/stamp/평택.png';
import 포천 from '../../assets/stamp/포천.png';
import 하남 from '../../assets/stamp/하남.png';
import 화성 from '../../assets/stamp/화성.png';
import 남한산성 from '../../assets/stamp/남한산성.svg';

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

const CULTURE_IMAGE_MAP: Record<string, string> = {
  '고양킨텍스': 고양킨텍스,
  '서울대공원': 서울대공원,
  '광명동굴': 광명동굴,
  '한강유채꽃': 한강유채꽃,
  '물의정원': 물의정원,
  '동두천계곡': 동두천계곡,
  '만화박물관': 만화박물관,
  '부천만화박물관': 만화박물관,
  '남한산성': 남한선성,
  '남한선성': 남한선성,
  '수원화성': 수원화성,
  '안산누에섬': 안산누에섬,
  '안양천': 안양천,
  '오산독산성': 오산독산성,
  '평택항': 평택항,
  '행복로': 행복로,
};

const REGION_IMAGE_MAP: Record<string, string> = {
  '광주': 광주, '광주시': 광주,
  '김포': 김포, '김포시': 김포,
  '시흥': 시흥, '시흥시': 시흥,
  '안성': 안성, '안성시': 안성,
  '연천': 연천, '연천군': 연천,
  '의정부': 의정부, '의정부시': 의정부,
  '파주': 파주, '파주시': 파주,
  '가평': 가평, '가평군': 가평,
  '고양': 고양, '고양시': 고양,
  '과천': 과천, '과천시': 과천,
  '광명': 광명, '광명시': 광명,
  '구리': 구리, '구리시': 구리,
  '군포': 군포, '군포시': 군포,
  '남양주': 남양주, '남양주시': 남양주,
  '동두천': 동두천, '동두천시': 동두천,
  '부천': 부천, '부천시': 부천,
  '성남': 성남, '성남시': 성남,
  '수원': 수원, '수원시': 수원,
  '안산': 안산, '안산시': 안산,
  '안양': 안양, '안양시': 안양,
  '양주': 양주, '양주시': 양주,
  '양평': 양평군, '양평군': 양평군,
  '여주': 여주, '여주시': 여주,
  '오산': 오산, '오산시': 오산,
  '용인': 용인, '용인시': 용인,
  '의왕': 의왕, '의왕시': 의왕,
  '이천': 이천, '이천시': 이천,
  '평택': 평택, '평택시': 평택,
  '포천': 포천, '포천시': 포천,
  '하남': 하남, '하남시': 하남,
  '화성': 화성, '화성시': 화성,
};

interface MemoStickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker?: (stampImage: string, stamp: RecentStampItem) => void;
}

const MemoStickerModal: React.FC<MemoStickerModalProps> = ({ isOpen, onClose, onSelectSticker }) => {
  const [stamps, setStamps] = useState<RecentStampItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<{ stamp: RecentStampItem; image: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStamps();
    }
  }, [isOpen]);

  const fetchStamps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyStamps();
      console.log('스탬프 API 응답:', response);

      if (response.isSuccess && response.result) {
        console.log('스탬프 result:', response.result);

        let stamps: RecentStampItem[] = [];

        if (Array.isArray(response.result)) {
          stamps = response.result;
        } else {
          const regional = (response.result as any).regional || (response.result as any).REGIONAL || [];
          const cultural = (response.result as any).cultural || (response.result as any).CULTURAL || [];
          stamps = [...regional, ...cultural];
        }

        console.log('처리된 스탬프:', stamps);
        setStamps(stamps);
      } else {
        setError('스탬프를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('스탬프 조회 실패:', err);
      setError('스탬프를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStickerClick = (stamp: RecentStampItem, stampImage: string) => {
    setSelectedSticker({ stamp, image: stampImage });
  };

  const handleSelectButton = () => {
    if (selectedSticker && onSelectSticker) {
      onSelectSticker(selectedSticker.image, selectedSticker.stamp);
      onClose();
    }
  };

  if (!isOpen) return null;

  const totalSlots = 18;
  const stickerSlots = Array.from({ length: totalSlots }, (_, index) => {
    if (index < stamps.length) {
      const stamp = stamps[index];
      let stampImage = 남한산성;

      if (stamp.type === 'REGIONAL') {
        stampImage = REGION_IMAGE_MAP[stamp.region] || 남한산성;
      } else if (stamp.type === 'CULTURAL' && stamp.spotName) {
        stampImage = CULTURE_IMAGE_MAP[stamp.spotName] || 남한산성;
      }

      return { type: 'sticker' as const, stamp, stampImage };
    }
    return { type: 'locked' as const };
  });

  return (
    <Modal title="스티커 추가" onClose={onClose}>
      <div className="flex flex-col w-full h-full max-h-[70vh]">
        <div className="flex-1 overflow-y-auto -mx-4 px-11 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">스탬프 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 justify-items-center">
              {stickerSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => slot.type === 'sticker' && handleStickerClick(slot.stamp, slot.stampImage)}
                  disabled={slot.type === 'locked'}
                  className={`w-[70px] h-[70px] rounded-xl border-2 flex items-center justify-center transition ${
                    slot.type === 'locked'
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : selectedSticker?.stamp.stampId === slot.stamp.stampId
                      ? 'border-[#FF7070] border-[3px] scale-105'
                      : 'border-gray-300 hover:border-[#FF7070] cursor-pointer'
                  }`}
                >
                  {slot.type === 'locked' ? (
                    <Lock className="w-8 h-8 text-gray-300" />
                  ) : (
                    <img
                      src={slot.stampImage}
                      alt={slot.stamp.region}
                      className="w-[60px] h-[60px] object-contain"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pb-4 pt-2">
          <button
            onClick={handleSelectButton}
            disabled={!selectedSticker}
            className={`w-full py-3 rounded-full font-semibold text-white transition ${
              selectedSticker
                ? 'bg-[#FF7070] hover:bg-[#FF5555]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            선택
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MemoStickerModal;
