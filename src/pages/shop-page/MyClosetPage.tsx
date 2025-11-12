import { useState, useMemo, useEffect, useCallback } from 'react';
import DropdownHeader from '../../components/common/DropdownHeader';
import WardrobeCard from '../../components/Shop/WardrobeCard';
import AddWardrobeCard from '../../components/Shop/AddWardrobeCard';
import { useCurrentCharacter } from '../../hooks/shop/useShopQueries';
import { useWardrobeList } from '../../hooks/shop/useWardrobeQueries';
import { useSaveWardrobe, useApplyWardrobe } from '../../hooks/shop/useWardrobeMutations';
import CatImage from '../../assets/accessories/cat.svg';
import DogImage from '../../assets/accessories/dog.svg';
import ClosetBg from '../../assets/accessories/closetBg.svg';

const MyClosetPage = () => {
  const [selectedWardrobeId, setSelectedWardrobeId] = useState<number | null>(null);

  const { data: currentCharacter } = useCurrentCharacter();
  const { data: wardrobes = [], isLoading } = useWardrobeList();


  // 현재 착용 중인 스타일 === 옷장 스타일 확인
  const isCurrentStyle = useCallback((wardrobe: typeof wardrobes[0]) => {
    if (!currentCharacter) return false;

    const equipped = currentCharacter.equipped;
    const clothingMatch =
      (wardrobe.clothing?.itemId === equipped.clothing?.itemId) ||
      (!wardrobe.clothing && !equipped.clothing);
    const expressionMatch =
      (wardrobe.expression?.itemId === equipped.expression?.itemId) ||
      (!wardrobe.expression && !equipped.expression);
    const effectMatch =
      (wardrobe.effect?.itemId === equipped.effect?.itemId) ||
      (!wardrobe.effect && !equipped.effect);
    const decorationMatch =
      (wardrobe.decoration?.itemId === equipped.decoration?.itemId) ||
      (!wardrobe.decoration && !equipped.decoration);

    return clothingMatch && expressionMatch && effectMatch && decorationMatch;
  }, [currentCharacter]);

  const characterImage = useMemo(() => {
    if (!currentCharacter) return CatImage;
    return currentCharacter.characterType === 'CAT' ? CatImage : DogImage;
  }, [currentCharacter]);

  useEffect(() => {
    if (currentCharacter && wardrobes.length > 0 && selectedWardrobeId === null) {
      const currentWardrobe = wardrobes.find(w => isCurrentStyle(w));
      if (currentWardrobe) {
        setSelectedWardrobeId(currentWardrobe.wardrobeId);
      }
    }
  }, [currentCharacter, wardrobes, selectedWardrobeId, isCurrentStyle]);

  const saveMutation = useSaveWardrobe();
  const applyMutation = useApplyWardrobe();

  const handleSaveWardrobe = () => {
    saveMutation.mutate();
  };

  const handleApplyWardrobe = () => {
    if (selectedWardrobeId === null) {
      alert('적용할 스타일을 선택해주세요.');
      return;
    }
    applyMutation.mutate(selectedWardrobeId);
  };

  return (
    <div
      className="relative min-h-screen bg-repeat"
      style={{ backgroundImage: `url(${ClosetBg})` }}
    >
      <DropdownHeader title="나의 옷장" />

      <main className="grid grid-cols-2 gap-4 p-4 pb-40 pt-[140px]">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-20">
            <p className="text-gray-500">로딩중...</p>
          </div>
        ) : (
          <>
            {wardrobes.map((wardrobe) => (
              <WardrobeCard
                key={wardrobe.wardrobeId}
                wardrobe={wardrobe}
                characterImage={characterImage}
                isSelected={selectedWardrobeId === wardrobe.wardrobeId}
                isCurrent={isCurrentStyle(wardrobe)}
                onClick={() => {
                  if (selectedWardrobeId === wardrobe.wardrobeId) {
                    setSelectedWardrobeId(null);
                  } else {
                    setSelectedWardrobeId(wardrobe.wardrobeId);
                  }
                }}
              />
            ))}

            <AddWardrobeCard onClick={handleSaveWardrobe} />
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white px-7 py-2">
        <button
          onClick={handleApplyWardrobe}
          disabled={selectedWardrobeId === null || applyMutation.isPending}
          className="flex w-full items-center justify-center rounded-xl bg-[#ff7070] py-[18px] text-xl font-bold text-white shadow-md transition cursor-pointer"
        >
          {applyMutation.isPending ? '적용 중...' : '스타일 변경하기'}
        </button>
      </footer>
    </div>
  );
};

export default MyClosetPage;
