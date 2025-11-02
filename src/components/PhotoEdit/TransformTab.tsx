import { useState } from 'react';
import { Crop, Move, RotateCw } from 'lucide-react';
import Slider from '../common/Slider';

interface TransformTabProps {
  rotation: number;
  position: { x: number; y: number };
  onRotationChange: (rotation: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onActiveModeChange?: (mode: 'crop' | 'move' | 'rotate' | null) => void;
  onCropConfirm?: () => void;
  onCropCancel?: () => void;
}

export default function TransformTab({
  rotation,
  position,
  onRotationChange,
  onPositionChange,
  onActiveModeChange,
  onCropConfirm,
  onCropCancel,
}: TransformTabProps) {
  const [activeMode, setActiveMode] = useState<'crop' | 'move' | 'rotate' | null>(
    null
  );

  // 회전 기능 (90도씩, 같은 방향으로 계속 회전 가능)
  const handleRotate = () => {
    onRotationChange(rotation + 90);
  };

  // 자르기 기능
  const handleCrop = () => {
    const newMode = activeMode === 'crop' ? null : 'crop';
    setActiveMode(newMode);
    onActiveModeChange?.(newMode);
  };

  // 이동 모드 토글
  const handleMove = () => {
    const newMode = activeMode === 'move' ? null : 'move';
    setActiveMode(newMode);
    onActiveModeChange?.(newMode);
  };

  // 회전 버튼 클릭 시 activeMode 변경
  const handleRotateClick = () => {
    const newMode = activeMode === 'rotate' ? null : 'rotate';
    setActiveMode(newMode);
    onActiveModeChange?.(newMode);
    handleRotate(); // 회전 실행
  };

  return (
    <div className="space-y-6">
      {/* 변형 도구 버튼들 */}
      <div className="flex gap-4 w-full">
        {/* 자르기 */}
        <button
          onClick={handleCrop}
          className={`flex-1 flex flex-col items-center justify-center py-6 transition-colors cursor-pointer ${
            activeMode === 'crop'
              ? 'text-[#FF7070]'
              : 'text-gray-700'
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center mb-2">
            <Crop size={32} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium">자르기</span>
        </button>

        {/* 이동 */}
        <button
          onClick={handleMove}
          className={`flex-1 flex flex-col items-center justify-center py-6 transition-colors cursor-pointer ${
            activeMode === 'move'
              ? 'text-[#FF7070]'
              : 'text-gray-700'
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center mb-2">
            <Move size={32} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium">이동</span>
        </button>

        {/* 회전 */}
        <button
          onClick={handleRotateClick}
          className={`flex-1 flex flex-col items-center justify-center py-6 transition-colors cursor-pointer ${
            activeMode === 'rotate'
              ? 'text-[#FF7070]'
              : 'text-gray-700'
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center mb-2">
            <RotateCw size={32} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium">회전</span>
        </button>
      </div>

      {/* 크롭 모드일 때 확인/취소 버튼 */}
      {activeMode === 'crop' && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => {
              onCropCancel?.();
              setActiveMode(null);
              onActiveModeChange?.(null);
            }}
            className="flex-1 py-3 px-4 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => {
              onCropConfirm?.();
              setActiveMode(null);
              onActiveModeChange?.(null);
            }}
            className="flex-1 py-3 px-4 rounded-lg bg-[#FF7070] text-white font-medium hover:bg-[#ff6060] transition-colors"
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}
