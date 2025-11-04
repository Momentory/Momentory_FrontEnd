import Slider from '../common/Slider';

interface AdjustTabProps {
  brightness: number;
  contrast: number;
  saturation: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
}

export default function AdjustTab({
  brightness,
  contrast,
  saturation,
  onBrightnessChange,
  onContrastChange,
  onSaturationChange,
}: AdjustTabProps) {
  // 0-100 범위로 변환 (중간값 50)
  const normalizeValue = (value: number) => {
    // 0-200 범위를 0-100으로 변환
    return ((value - 0) / (200 - 0)) * 100;
  };

  return (
    <div className="space-y-6">
      {/* 밝기 */}
      <Slider
        label="밝기"
        value={normalizeValue(brightness)}
        onChange={(normalized) => {
          const value = Math.round((normalized / 100) * 200);
          onBrightnessChange(value);
        }}
        min={0}
        max={100}
        step={1}
      />

      {/* 대비 */}
      <Slider
        label="대비"
        value={normalizeValue(contrast)}
        onChange={(normalized) => {
          const value = Math.round((normalized / 100) * 200);
          onContrastChange(value);
        }}
        min={0}
        max={100}
        step={1}
      />

      {/* 채도 */}
      <Slider
        label="채도"
        value={normalizeValue(saturation)}
        onChange={(normalized) => {
          const value = Math.round((normalized / 100) * 200);
          onSaturationChange(value);
        }}
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
}
