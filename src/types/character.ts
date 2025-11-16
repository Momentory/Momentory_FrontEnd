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

// 전체 캐릭터 타입 조회
export interface CharacterTypeInfo {
  characterType: CharacterType;
  displayName: string;
}

export interface AllCharacterTypesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CharacterTypeInfo[];
}

// 사용자가 보유한 전체 캐릭터 조회
export interface MyCharacter {
  characterId: number;
  characterType: CharacterType;
  level: number;
  equippedItems: EquippedItems;
  currentCharacter: boolean;
}

export interface MyCharactersResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyCharacter[];
}

// 캐릭터 생성
export interface CreateCharacterRequest {
  characterType: CharacterType;
}

export interface CreateCharacterResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    itemId: number;
    name: string;
    category: 'CLOTHING' | 'EXPRESSION' | 'EFFECT' | 'DECORATION';
    imageName: string;
    imageUrl: string;
    price: number;
    unlockLevel: number;
    eventId: number;
    eventTitle: string;
    limited: boolean;
  };
}

// 캐릭터 선택
export interface SelectCharacterResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    itemId: number;
    name: string;
    category: 'CLOTHING' | 'EXPRESSION' | 'EFFECT' | 'DECORATION';
    imageName: string;
    imageUrl: string;
    price: number;
    unlockLevel: number;
    eventId: number;
    eventTitle: string;
    limited: boolean;
  };
}

// 포인트 내역
export type PointAction = 'SIGNUP' | 'PHOTO_UPLOAD' | 'PURCHASE' | 'REWARD' | 'DAILY_BONUS';

export interface PointHistory {
  amount: number;
  action: PointAction;
  actionDesc: string;
  createdAt: string;
}

export interface PointHistoryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    points: PointHistory[];
  };
}
