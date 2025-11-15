import { useState, useEffect } from 'react';
import CloseIcon from '../../assets/icons/closeIcon.svg?react';
import './ColorPickerModal.css';

interface ColorPickerModalProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  onClose: () => void;
}

export default function ColorPickerModal({
  currentColor,
  onColorChange,
  onClose,
}: ColorPickerModalProps) {
  // HEX를 HSL로 변환하는 헬퍼 함수
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const initialHsl = hexToHsl(currentColor);
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [hue, setHue] = useState(
    isNaN(initialHsl.h) ? 0 : Math.max(0, Math.min(359, initialHsl.h))
  );
  const [saturation, setSaturation] = useState(
    isNaN(initialHsl.s) ? 50 : Math.max(0, Math.min(100, initialHsl.s))
  );
  const [lightness, setLightness] = useState(
    isNaN(initialHsl.l) ? 50 : Math.max(0, Math.min(100, initialHsl.l))
  );

  // currentColor가 변경되면 selectedColor도 업데이트
  useEffect(() => {
    setSelectedColor(currentColor);
    const hsl = hexToHsl(currentColor);
    setHue(Math.max(0, Math.min(359, hsl.h)));
    setSaturation(Math.max(0, Math.min(100, hsl.s)));
    setLightness(Math.max(0, Math.min(100, hsl.l)));
  }, [currentColor]);

  const handleConfirm = () => {
    onColorChange(selectedColor);
    onClose();
  };

  // HSL을 HEX로 변환하는 헬퍼 함수
  const hslToHex = (h: number, s: number, l: number): string => {
    // h는 0-360 범위로 제한
    h = h % 360;
    if (h < 0) h += 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value);
    const clampedHue = Math.max(0, Math.min(359, newHue));
    setHue(clampedHue);
    const hex = hslToHex(clampedHue, saturation, lightness);
    setSelectedColor(hex);
  };

  const handleSaturationLightnessChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    // 흑백 그라디언트이므로 lightness로 처리
    const newLightness = value;
    setLightness(newLightness);
    const hex = hslToHex(hue, saturation, newLightness);
    setSelectedColor(hex);
  };

  return (
    <div className="fixed inset-0 flex items-end justify-center z-[100] px-5 pb-32">
      <div className="w-full max-w-[256px] relative bg-white rounded-2xl shadow-lg px-4 py-3 flex flex-col">
        {/* 헤더 */}
        <div className="relative flex items-center justify-center w-full mb-3">
          <button
            onClick={onClose}
            aria-label="닫기"
            className="absolute left-0 cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-center">
            {selectedColor.toUpperCase()}
          </h1>
        </div>

        {/* 컨텐츠 */}
        <div className="w-full">
          {/* 현재 선택된 색상 미리보기 */}
          <div
            className="w-full h-20 rounded-lg mb-3 border border-gray-200"
            style={{ backgroundColor: selectedColor }}
          />

          {/* 무지개 색상 슬라이더 (Hue) */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max="359"
              value={isNaN(hue) ? 0 : Math.max(0, Math.min(359, hue))}
              onChange={handleHueChange}
              className="w-full rounded-full appearance-none cursor-pointer slider-hue"
              style={{
                background:
                  'linear-gradient(to right, #FF3C3C 0%, #FFCF4C 22.6%, #9EFF4A 46.15%, #4BC3FF 66.35%, #D23DDF 86.06%)',
              }}
            />
          </div>

          {/* 명도/채도 슬라이더 (Lightness) */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max="100"
              value={
                isNaN(lightness) ? 50 : Math.max(0, Math.min(100, lightness))
              }
              onChange={handleSaturationLightnessChange}
              className="w-full rounded-full appearance-none cursor-pointer slider-lightness"
              style={{
                background:
                  'linear-gradient(to right, #F5F5F5 0%, #E0E0E0 25%, #B0B0B0 50%, #808080 75%, #000000 100%)',
              }}
            />
          </div>

          {/* 확인 버튼 */}
          <button
            onClick={handleConfirm}
            className="w-full bg-[#FF7070] text-white py-2.5 rounded-lg font-medium hover:bg-[#ff6060] transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
