export type CharacterType = 'CAT' | 'DOG' | 'RABBIT';

export interface EquippedItem {
  itemId: number;
  name: string;
  imageUrl: string;
}

export interface LevelInfo {
  currentPoints: number;
  nextLevelPoints: number;
  remainingPoints: number;
  pointsForNextLevel: number;
}

export interface EquippedItems {
  clothing?: EquippedItem;
  expression?: EquippedItem;
  effect?: EquippedItem;
  decoration?: EquippedItem;
}

export interface CurrentCharacter {
  characterId: number;
  characterType: CharacterType;
  level: number;
  levelInfo: LevelInfo;
  equipped: EquippedItems;
}

export interface CurrentCharacterResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CurrentCharacter;
}

export interface EquippedItemDetail {
  itemId: number;
  name: string;
  category: 'CLOTHING' | 'EXPRESSION' | 'EFFECT' | 'DECORATION';
  imageName: string;
  imageUrl: string;
  price: number;
  unlockLevel: number;
}

export interface EquipItemResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: EquippedItemDetail;
}

export interface UnequipItemResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: EquippedItemDetail;
}
