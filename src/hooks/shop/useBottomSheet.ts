import { useState } from 'react';

export default function useBottomSheet(initialHeight = 100) {
  const [height, setHeight] = useState(initialHeight);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDrag = (
    startHeight: number,
    startExpanded: boolean,
    deltaY: number
  ) => {
    setHeight(Math.max(100, Math.min(460, startHeight + deltaY)));
    if (deltaY > 30) setIsExpanded(true);
    else if (deltaY < -30) setIsExpanded(false);
    else setHeight(startExpanded ? 460 : 100);
  };

  const toggle = () => {
    if (isExpanded) {
      setHeight(100);
      setIsExpanded(false);
    } else {
      setHeight(460);
      setIsExpanded(true);
    }
  };

  return { height, setHeight, isExpanded, setIsExpanded, handleDrag, toggle };
}