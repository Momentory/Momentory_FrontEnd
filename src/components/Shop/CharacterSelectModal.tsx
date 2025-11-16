import Modal from '../common/Modal';
import LockIcon from '../../assets/icons/lockIcon.svg?react';
import CatImage from '../../assets/accessories/cat.svg';
import DogImage from '../../assets/accessories/dog.svg';
import type { CharacterType } from '../../types/character';

interface MyCharacter {
  characterId: number;
  characterType: CharacterType;
  level: number;
  currentCharacter: boolean;
}

interface CharacterTypeInfo {
  characterType: CharacterType;
  displayName: string;
}

interface CharacterSelectModalProps {
  show: boolean;
  onClose: () => void;
  characterTypes: CharacterTypeInfo[];
  myCharacters: MyCharacter[];
  selectedCharacterId: number | null;
  onCharacterClick: (characterId: number, isCurrentCharacter: boolean) => void;
  onConfirm: () => void;
  onNavigateToCharacter: () => void;
  isPending: boolean;
}

const CharacterSelectModal = ({
  show,
  onClose,
  characterTypes,
  myCharacters,
  selectedCharacterId,
  onCharacterClick,
  onConfirm,
  onNavigateToCharacter,
  isPending,
}: CharacterSelectModalProps) => {
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

  if (!show) return null;

  return (
    <Modal
      title="캐릭터 변경"
      onClose={() => {
        onClose();
      }}
    >
      <div className="flex flex-col items-center text-center px-4 w-full">
        <p className="text-gray-600 mb-4">변경할 캐릭터를 선택해주세요</p>

        <div className="grid grid-cols-2 gap-3 w-full mb-6 max-h-[50vh] overflow-y-auto">
          {characterTypes.map((type) => {
            const ownedCharacter = myCharacters.find(
              (char) => char.characterType === type.characterType
            );
            const isOwned = ownedCharacter !== undefined;
            const isCurrent = ownedCharacter?.currentCharacter || false;

            return (
              <button
                key={type.characterType}
                onClick={() => {
                  if (isOwned && ownedCharacter) {
                    onCharacterClick(ownedCharacter.characterId, isCurrent);
                  }
                }}
                className={`
                  relative rounded-xl p-4 transition-all duration-200 border-2
                  ${
                    !isOwned
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
                      : selectedCharacterId === ownedCharacter?.characterId
                      ? 'bg-blue-100 border-blue-500 shadow-lg'
                      : isCurrent
                      ? 'bg-white border-[#ff7070]'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
                disabled={!isOwned || isPending || isCurrent}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-2 relative">
                    <img
                      src={getCharacterImage(type.characterType)}
                      alt={type.displayName}
                      className={`w-full h-full object-contain ${
                        !isOwned ? 'opacity-30' : ''
                      }`}
                    />
                    {!isOwned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LockIcon className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">
                    {type.displayName}
                  </h4>
                  {isOwned && ownedCharacter && (
                    <p className="text-xs text-gray-500 mt-1">
                      Lv. {ownedCharacter.level}
                    </p>
                  )}
                  {!isOwned && (
                    <p className="text-xs text-gray-400 mt-1">미보유</p>
                  )}
                </div>
                {isCurrent && (
                  <div className="absolute top-2 right-2 bg-[#ff7070] text-white px-2 py-1 rounded-full text-xs font-semibold">
                    현재
                  </div>
                )}
                {isOwned &&
                  selectedCharacterId === ownedCharacter?.characterId &&
                  !isCurrent && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">
                      ✓
                    </div>
                  )}
              </button>
            );
          })}

          <button
            onClick={onNavigateToCharacter}
            className="relative rounded-xl p-4 transition-all duration-200 border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                <div className="text-4xl text-gray-400">+</div>
              </div>
              <h4 className="text-sm font-bold text-gray-600">더보기</h4>
            </div>
          </button>
        </div>

        <div className="flex w-full gap-4 justify-between">
          <button
            onClick={onClose}
            className="flex-1 whitespace-nowrap px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
            disabled={isPending}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 whitespace-nowrap px-6 py-2 bg-[#ff7070] text-white rounded-lg font-semibold disabled:opacity-50"
            disabled={isPending || !selectedCharacterId}
          >
            {isPending ? '변경 중...' : '변경'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CharacterSelectModal;
