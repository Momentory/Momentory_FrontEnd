interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  disabled = false,
  className = '',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="w-full h-3 rounded-lg appearance-none cursor-pointer slider-red disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, #FF7070 0%, #FF7070 ${percentage}%, #D1D1D1 ${percentage}%, #D1D1D1 100%)`,
        }}
      />

      <style>{`
        input[type='range'].slider-red {
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          border-radius: 9999px;
          margin: 0;
          padding: 0;
          transition: background 0.15s ease;
        }

        input[type='range'].slider-red::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          border: 1px solid #B1B1B1;
          cursor: pointer;
          box-shadow: none;
          transition: transform 0.15s ease;
        }

        input[type='range'].slider-red:hover::-webkit-slider-thumb {
          transform: scale(1.15);
        }

        input[type='range'].slider-red::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          border: 1px solid #B1B1B1;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        input[type='range'].slider-red:hover::-moz-range-thumb {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
}
