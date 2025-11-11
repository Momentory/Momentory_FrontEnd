// 룰렛 슬롯 타입
export type RouletteSlotType = 'REGION' | 'ITEM';

// 룰렛 슬롯 조회 응답
export interface RouletteSlot {
  type: RouletteSlotType;
  name: string;
  imageUrl: string;
  itemId: number | null;
}

export interface RouletteSlotsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    slots: RouletteSlot[];
  };
}

// 룰렛 스핀 요청
export interface RouletteSpinRequest {
  type: RouletteSlotType;
  selectedName: string;
  itemId: number | null;
}

// 룰렛 스핀 응답
export interface RouletteSpinResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    rouletteId: number;
    reward: string;
    usedPoint: number;
    remainingPoint: number;
    deadline: string | null;
  };
}

// 룰렛 타입
export type RouletteType = 'TRAVEL' | 'GENERAL';

// 룰렛 내역 항목
export interface RouletteHistoryItem {
  rouletteId: number;
  type: RouletteType;
  reward: string;
  usedPoint: number;
  earnedPoint: number;
  completed: boolean;
  createdAt: string;
  deadline: string | null;
}

// 룰렛 내역 조회 응답
export interface RouletteHistoryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    roulettes: RouletteHistoryItem[];
  };
}

// 미완료 룰렛 조회 응답
export interface RouletteIncompleteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    roulettes: RouletteHistoryItem[];
  };
}
