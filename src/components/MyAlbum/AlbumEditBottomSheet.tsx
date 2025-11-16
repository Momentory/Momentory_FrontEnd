import React, { useState, useRef } from 'react';
import type { PageData } from '../../types/Templates';

interface AlbumEditBottomSheetProps {
  height: number;
  setHeight: (v: number) => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  pages: PageData[];
  onReorder: (newPages: PageData[]) => void;
  onImageClick?: (index: number) => void;
  currentPageIndex?: number;
  onAddClick?: (insertIndex: number) => void;
}

export default function AlbumEditBottomSheet({
  height,
  setHeight,
  isExpanded,
  setIsExpanded,
  pages,
  onReorder,
  onImageClick,
  currentPageIndex = 0,
  onAddClick,
}: AlbumEditBottomSheetProps) {
  const MAX_HEIGHT = 300;
  const MIN_HEIGHT = 60;

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;
    const startExpanded = isExpanded;

    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaY = startY - e.clientY;
      setHeight(
        Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight + deltaY))
      );
    };

    const onUp = (e: MouseEvent) => {
      e.preventDefault();
      const deltaY = startY - e.clientY;

      if (deltaY > 50) {
        setHeight(MAX_HEIGHT);
        setIsExpanded(true);
      } else if (deltaY < -50) {
        setHeight(MIN_HEIGHT);
        setIsExpanded(false);
      } else {
        setHeight(startExpanded ? MAX_HEIGHT : MIN_HEIGHT);
      }

      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleTouchStartDrag = (e: React.TouchEvent) => {
    const startY = e.touches[0].clientY;
    const startHeight = height;
    const startExpanded = isExpanded;

    const onTouchMove = (e: TouchEvent) => {
      const deltaY = startY - e.touches[0].clientY;
      setHeight(
        Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight + deltaY))
      );
    };

    const onTouchEnd = (e: TouchEvent) => {
      const deltaY = startY - (e.changedTouches[0]?.clientY || startY);

      if (deltaY > 50) {
        setHeight(MAX_HEIGHT);
        setIsExpanded(true);
      } else if (deltaY < -50) {
        setHeight(MIN_HEIGHT);
        setIsExpanded(false);
      } else {
        setHeight(startExpanded ? MAX_HEIGHT : MIN_HEIGHT);
      }

      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };

  const handleClick = () => {
    if (isExpanded) {
      setHeight(MIN_HEIGHT);
      setIsExpanded(false);
    } else {
      setHeight(MAX_HEIGHT);
      setIsExpanded(true);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggingIndex === null || draggingIndex === dropIndex) {
      setDraggingIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggingIndex, 1);
    newPages.splice(dropIndex, 0, draggedPage);

    onReorder(newPages);
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleTouchStart = (_e: React.TouchEvent, index: number) => {
    setDraggingIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingIndex === null) return;

    const touch = e.touches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const imageElement = elements.find((el) =>
      el.hasAttribute('data-image-index')
    );

    if (imageElement) {
      const overIndex = parseInt(
        imageElement.getAttribute('data-image-index') || '0'
      );
      setDragOverIndex(overIndex);
    }
  };

  const handleTouchEnd = () => {
    if (draggingIndex === null || dragOverIndex === null) {
      setDraggingIndex(null);
      setDragOverIndex(null);
      return;
    }

    if (draggingIndex === dragOverIndex) {
      setDraggingIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggingIndex, 1);
    newPages.splice(dragOverIndex, 0, draggedPage);

    onReorder(newPages);
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-2xl shadow-[0px_-4px_20px_rgba(0,0,0,0.25)] z-[150] transition-all duration-300 overflow-hidden scrollbar-hide"
      style={{ height: `${height}px` }}
    >
      <div
        className="w-full py-4 flex justify-center cursor-pointer"
        onMouseDown={handleDrag}
        onTouchStart={handleTouchStartDrag}
        onClick={handleClick}
      >
        <div className="w-20 h-1.5 bg-[#E2E2E2] rounded-full" />
      </div>

      <div className="p-6 pb-20 h-full overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[18px] font-semibold">앨범 순서 편집</h3>
          <button
            onClick={() => setIsAddMode(!isAddMode)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              isAddMode
                ? 'bg-[#FF7070] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isAddMode ? '완료' : '추가'}
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-1 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* 추가 모드일 때만 맨 앞에 추가 버튼 */}
          {isAddMode && (
            <button
              onClick={() => {
                onAddClick?.(0);
                setIsAddMode(false);
              }}
              className="flex-shrink-0 w-10 h-28 rounded-md border border-dashed border-[#FFAAAA] bg-[#FFF8F8] flex items-center justify-center hover:bg-[#FFE5E5] transition"
            >
              <span className="text-xl text-[#FF7070]">+</span>
            </button>
          )}

          {pages.map((page, index) => (
            <React.Fragment key={`${page.imageUrl || page.templateId}-${index}`}>
              {/* 이미지 카드 */}
              <div
                data-image-index={index}
                draggable={!isAddMode}
                onDragStart={() => !isAddMode && handleDragStart(index)}
                onDragOver={(e) => !isAddMode && handleDragOver(e, index)}
                onDrop={(e) => !isAddMode && handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => !isAddMode && handleTouchStart(e, index)}
                onTouchMove={!isAddMode ? handleTouchMove : undefined}
                onTouchEnd={!isAddMode ? handleTouchEnd : undefined}
                onClick={() => !isAddMode && onImageClick?.(index)}
                className={`relative flex-shrink-0 w-24 h-28 rounded-md overflow-hidden transition-all ${
                  isAddMode
                    ? 'cursor-default'
                    : `cursor-move ${
                        draggingIndex === index
                          ? 'opacity-50 scale-95'
                          : dragOverIndex === index
                          ? 'ring-2 ring-[#FF7070]'
                          : currentPageIndex === index
                          ? 'ring-2 ring-[#FF7070]'
                          : ''
                      }`
                }`}
              >
                {page.imageUrl || page.thumbnail ? (
                  <img
                    src={page.thumbnail || page.imageUrl || ''}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-400">새 페이지</span>
                  </div>
                )}
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {index + 1}
                </div>
                {!isAddMode && currentPageIndex === index && (
                  <div className="absolute inset-0 border-2 border-[#FF7070] pointer-events-none" />
                )}
              </div>

              {/* 추가 모드일 때만 이미지 뒤에 추가 버튼 */}
              {isAddMode && (
                <button
                  onClick={() => {
                    onAddClick?.(index + 1);
                    setIsAddMode(false);
                  }}
                  className="flex-shrink-0 w-10 h-28 rounded-md border border-dashed border-[#FFAAAA] bg-[#FFF8F8] flex items-center justify-center hover:bg-[#FFE5E5] transition"
                >
                  <span className="text-xl text-[#FF7070]">+</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {pages.length === 0 && (
          <div className="flex items-center justify-center h-40 text-gray-400">
            페이지가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
