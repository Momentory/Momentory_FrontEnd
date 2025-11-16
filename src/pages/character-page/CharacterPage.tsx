import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyCharacters, selectCharacter, getAllCharacterTypes, createCharacter, getPointHistory } from '../../api/character';
import { useCurrentCharacter, useUserPoint } from '../../hooks/shop/useShopQueries';
import Modal from '../../components/common/Modal';
import CatImage from '../../assets/accessories/cat.svg';
import DogImage from '../../assets/accessories/dog.svg';
import LockIcon from '../../assets/icons/lockIcon.svg?react';
import type { CharacterType } from '../../types/character';

export default function CharacterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCharacterType, setSelectedCharacterType] = useState<CharacterType | null>(null);
  const [showPointHistoryModal, setShowPointHistoryModal] = useState(false);

  const { data: currentCharacter } = useCurrentCharacter();
  const { data: pointData } = useUserPoint();
  const { data: myCharacters = [] } = useQuery({
    queryKey: ['myCharacters'],
    queryFn: getMyCharacters,
  });
  const { data: characterTypes = [] } = useQuery({
    queryKey: ['characterTypes'],
    queryFn: getAllCharacterTypes,
  });
  const { data: pointHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['pointHistory'],
    queryFn: getPointHistory,
    enabled: showPointHistoryModal,
  });

  const selectCharacterMutation = useMutation({
    mutationFn: selectCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCharacters'] });
      queryClient.invalidateQueries({ queryKey: ['currentCharacter'] });
      setShowConfirmModal(false);
      setSelectedCharacterId(null);
    },
    onError: (error: any) => {
      console.error('캐릭터 선택 실패:', error);
      alert(`캐릭터 선택에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
      setShowConfirmModal(false);
      setSelectedCharacterId(null);
    },
  });

  const createCharacterMutation = useMutation({
    mutationFn: createCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCharacters'] });
      queryClient.invalidateQueries({ queryKey: ['currentCharacter'] });
      setShowCreateModal(false);
      setSelectedCharacterType(null);
    },
    onError: (error: any) => {
      console.error('캐릭터 생성 실패:', error);
      alert(`캐릭터 생성에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
      setShowCreateModal(false);
      setSelectedCharacterType(null);
    },
  });

  const handleCharacterClick = (characterId: number, isCurrentCharacter: boolean) => {
    if (isCurrentCharacter) {
      return;
    }
    setSelectedCharacterId(characterId);
    setShowConfirmModal(true);
  };

  const confirmSelectCharacter = () => {
    if (selectedCharacterId !== null) {
      selectCharacterMutation.mutate(selectedCharacterId);
    }
  };

  const confirmCreateCharacter = () => {
    if (selectedCharacterType !== null) {
      createCharacterMutation.mutate({ characterType: selectedCharacterType });
    }
  };

  const getCharacterImage = (type: CharacterType) => {
    switch (type) {
      case 'CAT':
        return CatImage;
      case 'DOG':
        return DogImage;
      case 'RABBIT':
        return CatImage;
      default:
        return CatImage;
    }
  };

  const getCharacterName = (type: CharacterType) => {
    switch (type) {
      case 'CAT':
        return '고양이';
      case 'DOG':
        return '강아지';
      case 'RABBIT':
        return '토끼';
      default:
        return type;
    }
  };

  const level = currentCharacter?.level || 1;
  const currentPoints = currentCharacter?.levelInfo?.currentPoints || 0;
  const nextLevelPoints = currentCharacter?.levelInfo?.nextLevelPoints || 100;
  const expPercentage = Math.round((currentPoints / nextLevelPoints) * 100);
  const point = pointData?.userPoint.currentPoint || 0;
  const totalPoint = pointData?.userPoint.totalPoint || 0;
  const currentChar = myCharacters.find(char => char.currentCharacter);

  return (
    <>
      <motion.div
        className="w-full min-h-screen bg-white flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="sticky top-0 w-full bg-white flex items-center justify-between px-4 py-3 border-b shadow-sm z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-[17px] font-semibold text-gray-800">
            나의 캐릭터
          </h1>
          <div className="w-[38px]" />
        </div>

        {currentChar && (
          <div className="flex flex-col items-center mt-8 px-6">
            <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex flex-col items-center">
                <img
                  src={getCharacterImage(currentChar.characterType)}
                  alt="캐릭터"
                  className="w-[140px] h-[140px] object-contain mb-3"
                />
                <p className="text-[16px] font-semibold text-gray-800">
                  Lv.{level} {getCharacterName(currentChar.characterType)}
                </p>
              </div>

              <div className="w-full mt-5">
                <p className="text-[14px] text-gray-600 mb-1">
                  경험치: {currentPoints} / {nextLevelPoints}  (다음 레벨까지{100-expPercentage}%)
                </p>
                <div className="w-full h-[10px] bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FF7070]"
                    animate={{ width: `${expPercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              <div className="w-full flex justify-around mt-6">
                <button
                  onClick={() => setShowPointHistoryModal(true)}
                  className="flex items-center gap-1 px-4 py-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <p className="text-[13px] text-gray-500">포인트</p>
                    <p className="text-[15px] font-semibold text-gray-800">{point}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 mt-1" />
                </button>
                <div className="flex flex-col items-center px-4 py-2">
                  <p className="text-[13px] text-gray-500">통합 포인트</p>
                  <p className="text-[15px] font-semibold text-gray-800">{totalPoint}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-6 flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">내 캐릭터</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {characterTypes.map((type) => {
              const ownedCharacter = myCharacters.find(char => char.characterType === type.characterType);
              const isOwned = ownedCharacter !== undefined;
              const isCurrent = ownedCharacter?.currentCharacter || false;

              return (
                <button
                  key={type.characterType}
                  onClick={() => {
                    if (isOwned && ownedCharacter) {
                      handleCharacterClick(ownedCharacter.characterId, isCurrent);
                    } else if (!isOwned) {
                      setSelectedCharacterType(type.characterType);
                      setShowCreateModal(true);
                    }
                  }}
                  className={`
                    relative rounded-2xl p-4 transition-all duration-200 border-2
                    ${!isOwned
                      ? 'bg-gray-100 border-gray-300 hover:border-gray-400 hover:shadow-md opacity-60 hover:opacity-80'
                      : isCurrent
                      ? 'bg-white border-[#ff7070] shadow-lg'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                  disabled={isCurrent}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-3 relative">
                      <img
                        src={getCharacterImage(type.characterType)}
                        alt={type.displayName}
                        className={`w-full h-full object-contain ${!isOwned ? 'opacity-30' : ''}`}
                      />
                      {!isOwned && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <LockIcon className="w-10 h-10 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-800">
                      {type.displayName}
                    </h3>
                    {!isOwned && (
                      <p className="text-sm text-gray-400 mt-1">
                        미보유
                      </p>
                    )}
                  </div>
                  {isCurrent && (
                    <div className="absolute top-2 right-2 bg-[#FF7070] text-white px-2 py-1 rounded-full text-xs font-semibold">
                      현재
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {showConfirmModal && (
        <Modal
          title="캐릭터 변경"
          onClose={() => {
            setShowConfirmModal(false);
            setSelectedCharacterId(null);
          }}
        >
          <div className="flex flex-col items-center text-center px-3.5 w-full">
            <p className="text-gray-700 mb-6">
              선택한 캐릭터로<br />변경하시겠습니까?
            </p>

            <div className="flex w-full gap-4 justify-between">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedCharacterId(null);
                }}
                className="flex-1 whitespace-nowrap px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
                disabled={selectCharacterMutation.isPending}
              >
                취소
              </button>
              <button
                onClick={confirmSelectCharacter}
                className="flex-1 whitespace-nowrap px-6 py-2 bg-[#FF7070] text-white rounded-lg font-semibold disabled:opacity-50"
                disabled={selectCharacterMutation.isPending}
              >
                {selectCharacterMutation.isPending ? '변경 중...' : '확인'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showCreateModal && selectedCharacterType && (
        <Modal
          title="캐릭터 구매"
          onClose={() => {
            setShowCreateModal(false);
            setSelectedCharacterType(null);
          }}
        >
          <div className="flex flex-col items-center text-center px-4 w-full">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto mb-4">
                <img
                  src={getCharacterImage(selectedCharacterType)}
                  alt={characterTypes.find(t => t.characterType === selectedCharacterType)?.displayName}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {characterTypes.find(t => t.characterType === selectedCharacterType)?.displayName}
              </h3>
              <p className="text-gray-600 mb-4">
                이 캐릭터를 구매하시겠습니까?
              </p>
            </div>

            <div className="flex w-full gap-4 justify-between">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedCharacterType(null);
                }}
                className="flex-1 whitespace-nowrap px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
                disabled={createCharacterMutation.isPending}
              >
                취소
              </button>
              <button
                onClick={confirmCreateCharacter}
                className="flex-1 whitespace-nowrap px-6 py-2 bg-[#FF7070] text-white rounded-lg font-semibold disabled:opacity-50"
                disabled={createCharacterMutation.isPending}
              >
                {createCharacterMutation.isPending ? '구매 중...' : '구매하기'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showPointHistoryModal && (
        <Modal
          title="포인트 내역"
          onClose={() => setShowPointHistoryModal(false)}
        >
          <div className="flex flex-col px-4 w-full max-h-[500px] overflow-y-auto">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center py-10">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            ) : pointHistory.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <div className="text-gray-500">포인트 내역이 없습니다</div>
              </div>
            ) : (
              <div className="space-y-3">
                {pointHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {history.actionDesc}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(history.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="ml-4">
                      <p
                        className={`text-base font-bold ${
                          history.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {history.amount > 0 ? '+' : ''}{history.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
