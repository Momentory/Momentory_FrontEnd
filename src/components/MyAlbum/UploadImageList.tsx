import React, { useState } from "react";
import CheckIcon from "../../assets/icons/CheckIcon.svg?react";

interface UploadImageSelectorProps {
  images: string[];
  onSelect: (images: string[]) => void;
  maxSelection?: number;
}

const UploadImageSelector: React.FC<UploadImageSelectorProps> = ({ 
  images, 
  onSelect, 
  maxSelection = 999
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleToggle = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(img => img !== image));
    } else {
      if (selectedImages.length < maxSelection) {
        setSelectedImages([...selectedImages, image]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedImages.length > 0) {
      onSelect(selectedImages);
    }
  };

  return (
    <div className="flex flex-col w-full h-full max-h-[100vh]">
      <div className="flex-1 overflow-y-auto -mx-4 px-4">
        <div className="grid grid-cols-2 gap-4 pb-4">
          {images.map((image, index) => {
            const isSelected = selectedImages.includes(image);
            const selectionOrder = selectedImages.indexOf(image);
            
            return (
              <div
                key={index}
                className={`relative w-full aspect-[3/5] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 
                  ${isSelected ? "ring-4 ring-[#FF7070]" : "ring-2 ring-transparent hover:ring-[#FFD1D1]"}
                `}
                onClick={() => handleToggle(image)}
              >
                <img
                  src={image}
                  alt={`template-${index}`}
                  className="w-full h-full object-cover"
                />

                <div
                  className={`absolute top-2 left-2 w-8 h-8 rounded-full border-2 flex items-center justify-center
                    ${
                      isSelected
                        ? "border-[#FF7070] bg-[#FF7070]"
                        : "border-[#8B8B8B] border-dashed bg-white"
                    }
                  `}
                >
                  {isSelected && (
                    maxSelection === 1 ? (
                      <CheckIcon className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white text-sm font-bold">{selectionOrder + 1}</span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-4 -mx-4 px-4 border-t border-gray-200 mt-2">
        <button
          onClick={handleConfirm}
          disabled={selectedImages.length === 0}
          className={`flex-1 py-3 rounded-3xl font-bold transition ${
            selectedImages.length > 0
              ? "bg-[#FF7070] text-white hover:bg-[#E56363]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          선택 ({selectedImages.length})
        </button>
      </div>
    </div>
  );
};

export default UploadImageSelector;
