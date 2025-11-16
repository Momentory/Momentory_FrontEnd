export interface ItemTransform {
  scale?: number;
  scaleX?: number;
  translateX?: number; // vw 단위
  translateY?: number; // vh 단위
  rotate?: number;
}

export const categoryDefaults: Record<string, ItemTransform> = {
  CLOTHING: {
    scale: 1.0,
    translateX: 0,
    translateY: 0,
  },
  EXPRESSION: {
    scale: 0.4,
    translateX: -12,
    translateY: -8,
  },
  EFFECT: {
    scale: 0.9,
    translateX: -10,
    translateY: 0,
  },
  DECORATION: {
    scale: 0.3,
    translateX: -10,
    translateY: -80,
  },
};

/**
 * 개별 아이템 예외 설정
 * 기본값과 다른 위치/크기가 필요한 아이템만 여기에 추가
 * scaleX: -1 <- 좌우 반전이 필요한 아이템에 사용
 */

export const itemExceptions: Record<number, ItemTransform> = {
  // 장식
  18: { scale: 0.3, translateX: -40, translateY: -70 }, // 리본 - 머리
  14: { scale: 0.3, translateX: 60, translateY: -50 }, // 장미
  5: { scale: 0.3, translateX: 30, translateY: -80 }, // 깃털
  7: { scale: 0.3, scaleX: -1, translateX: 16, translateY: 68 }, // 리본 - 목
  17: { scale: 0.3, scaleX: -1, translateX: 16, translateY: 68 },
  9: { scale: 0.3, scaleX: -1, translateX: 16, translateY: 68 },
  8: { scale: 0.55, scaleX: -1, translateX: 6, translateY: -8 }, // 안경
  15: { scale: 0.3, translateX: 10, translateY: -80 }, // 잠옷모자
  12: { scale: 0.3, scaleX: -1, translateX: 5, translateY: -100 }, // 파티모자
  13: { scale: 0.5, scaleX: -1, translateX: 5, translateY: -40 }, // 천사장식
  16: { scale: 0.2, scaleX: -1, translateX: -20, translateY: -130 }, // 왕관

};

export const getItemTransform = (
  itemId: number,
  category: string
): ItemTransform => {
  if (itemExceptions[itemId]) {
    return itemExceptions[itemId];
  }

  return (
    categoryDefaults[category] || {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    }
  );
};

export const transformToCSS = (transform: ItemTransform): string => {
  const scale = transform.scale ?? 1;
  const scaleX = transform.scaleX ?? 1;
  const x = transform.translateX ?? 0;
  const y = transform.translateY ?? 0;
  const rotate = transform.rotate ?? 0;

  return `scale(${scale}) scaleX(${scaleX}) translate(${x}%, ${y}%) rotate(${rotate}deg)`;
};
