// 하단시트의 높이 & 확장 여부 관리
import { useState } from 'react';

export default function useBottomSheet(initialHeight = 40) {
  const [height, setHeight] = useState(initialHeight);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDrag = (
    startHeight: number,
    startExpanded: boolean,
    deltaY: number
  ) => {
    setHeight(Math.max(40, Math.min(516, startHeight + deltaY)));
    if (deltaY > 30) setIsExpanded(true);
    else if (deltaY < -30) setIsExpanded(false);
    else setHeight(startExpanded ? 516 : 40);
  };

  const toggle = () => {
    if (isExpanded) {
      setHeight(40);
      setIsExpanded(false);
    } else {
      setHeight(516);
      setIsExpanded(true);
    }
  };

  return { height, setHeight, isExpanded, setIsExpanded, handleDrag, toggle };
}
