export type ItemCategory = 'CLOTHING' | 'EXPRESSION' | 'EFFECT' | 'DECORATION';

export interface ShopItem {
  itemId: number;
  name: string;
  category: ItemCategory;
  imageUrl: string;
  price: number;
  unlockLevel: number;
  owned: boolean;
  availableCharacterTypes?: string[];
}

export interface PurchasedItem {
  itemId: number;
  name: string;
  category: ItemCategory;
  imageName: string;
  imageUrl: string;
  price: number;
  unlockLevel: number;
}

export interface ShopItemsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ShopItem[];
}

export interface PurchaseItemResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: PurchasedItem;
}

export interface ShopAccessory {
  id: number;
  name: string;
  icon: string;
  type: string;
  price: number;
  description?: string;
}

export interface UserPoint {
  currentPoint: number;
  totalPoint: number;
}

export interface PointInfo {
  level: number;
  userPoint: UserPoint;
}

export interface PointResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: PointInfo;
}

export interface MyItem {
  itemId: number;
  name: string;
  category: ItemCategory;
  imageUrl: string;
  equipped: boolean;
  availableCharacterTypes?: string[];
}

export interface MyItemsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyItem[];
}

export interface WardrobeItem {
  itemId: number;
  name: string;
  imageUrl: string;
}

export interface Wardrobe {
  wardrobeId: number;
  clothing: WardrobeItem | null;
  expression: WardrobeItem | null;
  effect: WardrobeItem | null;
  decoration: WardrobeItem | null;
}

export interface WardrobeListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Wardrobe[];
}

export interface WardrobeSaveResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Wardrobe;
}

export interface WardrobeApplyResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Wardrobe;
}