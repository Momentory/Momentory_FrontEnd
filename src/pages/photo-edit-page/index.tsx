import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CloseIcon from '../../assets/icons/closeIcon.svg?react';
import DropletIcon from '../../assets/droplet.svg?react';
import MaximizeIcon from '../../assets/maximize.svg?react';
import DropdownHeader from '../../components/common/DropdownHeader';
import AdjustTab from '../../components/PhotoEdit/AdjustTab';
import FilterTab from '../../components/PhotoEdit/FilterTab';
import TransformTab from '../../components/PhotoEdit/TransformTab';

const SliderIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <rect
      width="36"
      height="36"
      fill="url(#pattern0_267_282)"
      fillOpacity="0.6"
    />
    <defs>
      <pattern
        id="pattern0_267_282"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use xlinkHref="#image0_267_282" transform="scale(0.00520833)" />
      </pattern>
      <image
        id="image0_267_282"
        width="192"
        height="192"
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAaTSURBVHgB7d1NbttWFMXx58+ZrXrmgSFwB/XQw3oFzVK6g9o7aHbhYXbQLME7qEp44CFhDw1YfQzUAk1CSuS9LyLv+f8mFoIICG58/ERTOvcgQcrV1dUv+cuHw8PDX/PXavPHj+v1+vHt7e3++fl5lYQcJEj4KTs7O/v94ODgt76/l4Pwx+vr632TJQEEQED7zX9+fv5nfni941MeX15ebhVCcJgQXvuTP+3+zd+63jwnPE6A4C4vL6vT09O/0gjv7++3T09Pn1NgnADBnZyc3KXxPqTgCEBw+aL35zTS5jdFoRGA+Ia89v9alYIjAJBGACCNAEAaAYA0AgBpBADSCACkEQBIIwCQRgAgjQBAGgGANAIAaQQA0ggApBEASHP/THBH7wz6FevlWS6X6zR/xebjFoBde2fQz7uXJ0gA/uM9H5cAjOidQT+3Xp5oAdhwm4/LNcCI3hn0k+nlGcltPuYTwNI7g34evTxBT4AvPOZjPgGMvTPoF76Xx8g8H3MALL0z6KfQy2PhMR+PawBe+5dTJfSpkhE3wiDNIwB/J5TymNDHPB+PAHxKKIUA9Nt/APKFCAEoJM/2PqGTx3zMAVitVp/zl48JrvLvuD/m2a4SvstrPi4XwTmJd4nj2tPj8fHxXUIXt/m4BCAHsckhuE2cBGbtT7Z2lu1ME77hPR/3t0NXWf5H3uUbZNfr9ZqbZLtpf5P2qb2e2rykdBPkrRDF5sOOsOCsAajrOvT3CDfCII0AQBoBgDQCAGkEANIIAKQRAEgjAJBGACCNAEAaAYA0AgBpBADSCACkEQBIIwCQRgDis/Q2hf+cNwGIz1JbQwAwb5beJoVeoqOE0JqmWS0Wi4v88GbI89r2hbquH1JwnAACRvQ2yfQSEQABQ3qb1HqJqEUR09HbVKx3Z+rkAtCxx7jYHlpMm0wAdt1j7L2HFtMmEYARe4zd9tBi2iQugkfsMWZPr4jwJ4Blj7HHHlpMW/gTwLjHmD29wYUPgGWPMXt641O4BrDsMa4SQuNOMKQRAEgjAJBGACCNAEAaAYA0AgBpBADSCACkEQBIIwCQRgAgjQBAGgGANAIAaQQA0o6Ts47eHWwwn1GK9Ta5fSh+196duanr2mVGUefzo3n3Nrn95w7s3ZkNjwBEns+euPU2uVwDjOjdkcJ83Ln1Npl/ull6d+bAegJEn88+efQ2mU8AY+9OeMynKHNvkzkAlt4dBcynHI/eJo9rAF7b9mM+5VTJiBthkOYRAMseWgXMpxzzGlePAFj20CpgPuXsPwCWPbQKmE85HnuMzQHYLFXbun1QFfMpo91mmWe7SkYuF8Ej9tBKYT7u3PYYuwRgyB5aRczHj/ceY/cVSR17aGfL692g/4o2nx+k2B7j8DvClsvlOhl4BwDTwo0wSCMAkEYAII0AQBoBgDQCAGkEANIIAKQRAEgjAJBGACCNAEAaAYA0AgBpBADSCACkKQTA0svD53iDUwiApZaEAAQXPgCWXh6P3hlM21EKrmma1WKxuMgPb4Y8r20fqOv6ISE0iYvgEb08br0zmDaJAAzp5fHuncG0yVV+dPTyFOudwbTReTMzHXuGi+3RjY4AzMSue4a99+hGRwBmYMSeYbc9utHxVogZGLFn2G2PbnScABNn2TPssUc3Ok6AiTPuGTbv0Y2OAEycZc+wxx7d6AjA9Fn2DFcJvQgApBEASCMAkEYAII0AQBoBgDQCAGkEANIIAKQRAEgjAJBGACCNAEAaAYA0AgBpBADS3D8T3NFbE12xXp7lcrlOKDZftwDs2lsTnXcvDwH4P+/5ugRgRG9NdG69PATgu9zm63INMKK3Jjp6ecpym6/5BLD01kTn0cvDCdDNY77mE8DYWxMdvTxlmedrDoCltyY6ennK8pivxzUAr/27VQklVcmIG2GQ5hEAyx7e6FizWpZ5vh4BsOzhjY4AlLX/AFj28EbHnuGyPOZrDsBmqdzW7Ytq2m2TeTarhCK85utyETxiD2907Bkuy22+LgEYsoc3OvYMl+U9X/e3Q3fs4Y2u2J5h3grxRbH5siNs4qwBqOua/+Me3AiDNAIAaQQA0ggApBEASCMAkEYAII0AQBoBgDQCAGkEANIIAKQRAEgjAJBGACCNAEAaAZg+S+8Sn9PeggBMn6V2hgBsQQAmztK7RC/RdkcJk9Y0zWqxWFzkhzdDnte2J9R1/ZDQixNgBkb0LtFLtCMCMANDepfoJRqGyoyZ6ehdKtabE90/HaDNaQxkY1wAAAAASUVORK5CYII="
      />
    </defs>
  </svg>
);

type TabType = 'adjust' | 'filter' | 'transform';

export default function PhotoEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(
    location.state?.imageUrl || '/images/everland.jpg'
  );

  const [activeTab, setActiveTab] = useState<TabType>('adjust');
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [filterIntensity, setFilterIntensity] = useState(50);
  const [selectedFilter, setSelectedFilter] = useState('원본');

  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeTransformMode, setActiveTransformMode] = useState<
    'crop' | 'move' | 'rotate' | null
  >(null);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropArea, setCropArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isCropDragging, setIsCropDragging] = useState(false);
  const [isCropResizing, setIsCropResizing] = useState<
    'nw' | 'ne' | 'sw' | 'se' | null
  >(null);
  const [cropDragStart, setCropDragStart] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'adjust', label: '조정', icon: <SliderIcon className="w-5 h-5" /> },
    { id: 'filter', label: '필터', icon: <DropletIcon className="w-5 h-5" /> },
    {
      id: 'transform',
      label: '변형',
      icon: <MaximizeIcon className="w-5 h-5" />,
    },
  ];

  const handleNext = () => {
    navigate('/photo-upload-progress', {
      state: {
        selectedImage,
        brightness,
        contrast,
        saturation,
        filterIntensity,
        selectedFilter,
        rotation,
        position,
        markerColor: location.state?.markerColor,
        markerLocation: location.state?.markerLocation,
      },
    });
  };

  const getFilterStyle = () => {
    let brightnessValue = (brightness / 50) * 100;
    let contrastValue = (contrast / 50) * 100;
    let saturationValue = (saturation / 50) * 100;

    if (selectedFilter === '원본') {
      return `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%)`;
    }

    if (selectedFilter === '선명하게') {
      const extraContrast = (filterIntensity / 100) * 20;
      const extraSaturate = (filterIntensity / 100) * 20;
      contrastValue = contrastValue * (1 + extraContrast / 100);
      saturationValue = saturationValue * (1 + extraSaturate / 100);
      return `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%)`;
    } else if (selectedFilter === '밝은') {
      const extraBrightness = (filterIntensity / 100) * 20;
      brightnessValue = brightnessValue * (1 + extraBrightness / 100);
      return `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%)`;
    } else if (selectedFilter === '어두운') {
      const reducedBrightness = (filterIntensity / 100) * 30;
      brightnessValue = brightnessValue * (1 - reducedBrightness / 100);
      return `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%)`;
    } else if (selectedFilter === '따뜻한') {
      const sepiaValue = (filterIntensity / 100) * 30;
      const extraSaturate = (filterIntensity / 100) * 15;
      saturationValue = saturationValue * (1 + extraSaturate / 100);
      return `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%) sepia(${sepiaValue}%)`;
    } else if (selectedFilter === '영화') {
      const sepiaValue = (filterIntensity / 100) * 50;
      const extraContrast = (filterIntensity / 100) * 10;
      contrastValue = contrastValue * (1 + extraContrast / 100);
      return `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%) sepia(${sepiaValue}%)`;
    } else if (selectedFilter === '모노') {
      const grayscaleValue = filterIntensity;
      return `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%) grayscale(${grayscaleValue}%)`;
    } else if (selectedFilter === '흑백') {
      const extraContrast = (filterIntensity / 100) * 20;
      contrastValue = contrastValue * (1 + extraContrast / 100);
      return `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%) grayscale(100%)`;
    }

    return `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%)`;
  };

  useEffect(() => {
    if (activeTransformMode === 'crop' && imageContainerRef.current) {
      if (!cropArea) {
        setTimeout(() => {
          if (imageContainerRef.current) {
            const container = imageContainerRef.current;
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const defaultSize = Math.min(containerWidth, containerHeight) * 0.8;
            setCropArea({
              x: (containerWidth - defaultSize) / 2,
              y: (containerHeight - defaultSize) / 2,
              width: defaultSize,
              height: defaultSize,
            });
          }
        }, 0);
      }
    } else if (activeTransformMode !== 'crop') {
      setCropArea(null);
    }
  }, [activeTransformMode]);

  const handleImageMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (activeTransformMode === 'move') {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        };
      }
    },
    [activeTransformMode, position]
  );

  const handleCropMouseDown = useCallback(
    (e: React.MouseEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
      if (activeTransformMode !== 'crop' || !cropArea) return;
      e.preventDefault();
      e.stopPropagation();
      if (type === 'move') {
        setIsCropDragging(true);
        setCropDragStart({
          x: e.clientX - cropArea.x,
          y: e.clientY - cropArea.y,
        });
      } else {
        setIsCropResizing(type);
        setCropDragStart({
          x: e.clientX,
          y: e.clientY,
        });
      }
    },
    [activeTransformMode, cropArea]
  );

  const handleImageMouseMove = useCallback(
    (e: MouseEvent) => {
      if (activeTransformMode === 'move') {
        if (
          !isDragging ||
          !dragStartRef.current ||
          activeTransformMode !== 'move'
        )
          return;
        setPosition({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y,
        });
      } else if (activeTransformMode === 'crop') {
        if (!imageContainerRef.current || !cropArea) return;
        const container = imageContainerRef.current;
        const containerRect = container.getBoundingClientRect();

        if (isCropDragging && cropDragStart) {
          const newX = e.clientX - containerRect.left - cropDragStart.x;
          const newY = e.clientY - containerRect.top - cropDragStart.y;

          setCropArea({
            ...cropArea,
            x: Math.max(
              0,
              Math.min(newX, container.offsetWidth - cropArea.width)
            ),
            y: Math.max(
              0,
              Math.min(newY, container.offsetHeight - cropArea.height)
            ),
          });
        } else if (isCropResizing && cropDragStart) {
          const deltaX = e.clientX - cropDragStart.x;
          const deltaY = e.clientY - cropDragStart.y;
          let newCropArea = { ...cropArea };

          if (isCropResizing === 'se') {
            newCropArea.width = Math.min(
              container.offsetWidth - cropArea.x,
              Math.max(50, cropArea.width + deltaX)
            );
            newCropArea.height = Math.min(
              container.offsetHeight - cropArea.y,
              Math.max(50, cropArea.height + deltaY)
            );
          } else if (isCropResizing === 'sw') {
            const newWidth = Math.max(50, cropArea.width - deltaX);
            const newX = cropArea.x + (cropArea.width - newWidth);
            if (newX >= 0) {
              newCropArea.x = newX;
              newCropArea.width = newWidth;
            }
            newCropArea.height = Math.min(
              container.offsetHeight - cropArea.y,
              Math.max(50, cropArea.height + deltaY)
            );
          } else if (isCropResizing === 'ne') {
            newCropArea.width = Math.min(
              container.offsetWidth - cropArea.x,
              Math.max(50, cropArea.width + deltaX)
            );
            const newHeight = Math.max(50, cropArea.height - deltaY);
            const newY = cropArea.y + (cropArea.height - newHeight);
            if (newY >= 0) {
              newCropArea.y = newY;
              newCropArea.height = newHeight;
            }
          } else if (isCropResizing === 'nw') {
            const newWidth = Math.max(50, cropArea.width - deltaX);
            const newX = cropArea.x + (cropArea.width - newWidth);
            const newHeight = Math.max(50, cropArea.height - deltaY);
            const newY = cropArea.y + (cropArea.height - newHeight);
            if (newX >= 0 && newY >= 0) {
              newCropArea.x = newX;
              newCropArea.y = newY;
              newCropArea.width = newWidth;
              newCropArea.height = newHeight;
            }
          }

          setCropArea(newCropArea);
          setCropDragStart({ x: e.clientX, y: e.clientY });
        }
      }
    },
    [
      isDragging,
      isCropDragging,
      isCropResizing,
      activeTransformMode,
      cropArea,
      cropDragStart,
      position,
    ]
  );

  const handleImageMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsCropDragging(false);
    setIsCropResizing(null);
    dragStartRef.current = null;
    setCropDragStart(null);
  }, []);

  useEffect(() => {
    if (activeTransformMode === 'move' || activeTransformMode === 'crop') {
      window.addEventListener('mousemove', handleImageMouseMove);
      window.addEventListener('mouseup', handleImageMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleImageMouseMove);
        window.removeEventListener('mouseup', handleImageMouseUp);
      };
    }
  }, [activeTransformMode, handleImageMouseMove, handleImageMouseUp]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <DropdownHeader
        title="Edit Photo"
        hasDropdown={false}
        leftIcon={<CloseIcon className="w-5 h-5" />}
        rightAction={
          <button
            onClick={handleNext}
            className="text-blue-500 font-semibold text-[15px]"
          >
            Next
          </button>
        }
      />

      <div className="flex justify-center p-6">
        <div
          ref={imageContainerRef}
          className="w-[340px] bg-gray-100 rounded-lg overflow-hidden relative"
          style={{ aspectRatio: '340/290' }}
        >
          {selectedImage ? (
            <>
              <img
                src={selectedImage}
                alt="Selected"
                className={`w-full h-full rounded-lg transition-transform duration-200 ${
                  activeTransformMode === 'move' ? 'cursor-move' : ''
                }`}
                style={{
                  filter: getFilterStyle(),
                  transform: `rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                  objectFit: 'cover',
                }}
                onMouseDown={handleImageMouseDown}
                draggable={false}
              />

              {activeTransformMode === 'crop' && cropArea && (
                <>
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50"
                    style={{
                      clipPath: `polygon(
                        0% 0%,
                        0% 100%,
                        ${(cropArea.x / imageContainerRef.current!.offsetWidth) * 100}% 100%,
                        ${(cropArea.x / imageContainerRef.current!.offsetWidth) * 100}% ${(cropArea.y / imageContainerRef.current!.offsetHeight) * 100}%,
                        ${((cropArea.x + cropArea.width) / imageContainerRef.current!.offsetWidth) * 100}% ${(cropArea.y / imageContainerRef.current!.offsetHeight) * 100}%,
                        ${((cropArea.x + cropArea.width) / imageContainerRef.current!.offsetWidth) * 100}% ${((cropArea.y + cropArea.height) / imageContainerRef.current!.offsetHeight) * 100}%,
                        ${(cropArea.x / imageContainerRef.current!.offsetWidth) * 100}% ${((cropArea.y + cropArea.height) / imageContainerRef.current!.offsetHeight) * 100}%,
                        ${(cropArea.x / imageContainerRef.current!.offsetWidth) * 100}% 100%,
                        100% 100%,
                        100% 0%
                      )`,
                    }}
                  />

                  <div
                    className="absolute border-2 border-white"
                    style={{
                      left: `${cropArea.x}px`,
                      top: `${cropArea.y}px`,
                      width: `${cropArea.width}px`,
                      height: `${cropArea.height}px`,
                    }}
                    onMouseDown={(e) => handleCropMouseDown(e, 'move')}
                  >
                    <div
                      className="absolute -top-1 -left-1 w-4 h-4 bg-white border border-gray-400 cursor-nwse-resize"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCropMouseDown(e, 'nw');
                      }}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-white border border-gray-400 cursor-nesw-resize"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCropMouseDown(e, 'ne');
                      }}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-4 h-4 bg-white border border-gray-400 cursor-nesw-resize"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCropMouseDown(e, 'sw');
                      }}
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border border-gray-400 cursor-nwse-resize"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleCropMouseDown(e, 'se');
                      }}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image selected
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium relative flex flex-col items-center justify-center gap-1 ${
              activeTab === tab.id ? 'text-gray-900' : 'text-gray-500'
            } ${index < tabs.length - 1 ? 'border-r border-gray-200' : ''}`}
          >
            <div
              className={
                activeTab === tab.id ? 'text-gray-900' : 'text-gray-500'
              }
            >
              {tab.icon}
            </div>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div
                className="w-1 h-1 rounded-full mt-0.5"
                style={{ backgroundColor: '#BFBFBF' }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'adjust' && (
          <AdjustTab
            brightness={brightness}
            contrast={contrast}
            saturation={saturation}
            onBrightnessChange={setBrightness}
            onContrastChange={setContrast}
            onSaturationChange={setSaturation}
          />
        )}
        {activeTab === 'filter' && (
          <FilterTab
            intensity={filterIntensity}
            selectedFilter={selectedFilter}
            onIntensityChange={setFilterIntensity}
            onFilterChange={setSelectedFilter}
            previewImage={selectedImage}
          />
        )}
        {activeTab === 'transform' && (
          <TransformTab
            rotation={rotation}
            position={position}
            onRotationChange={setRotation}
            onPositionChange={setPosition}
            onActiveModeChange={setActiveTransformMode}
            onCropConfirm={async () => {
              if (!cropArea || !selectedImage || !imageContainerRef.current)
                return;

              const img = new Image();
              img.src = selectedImage;

              await new Promise((resolve) => {
                img.onload = resolve;
              });

              const container = imageContainerRef.current;
              const scaleX = img.width / container.offsetWidth;
              const scaleY = img.height / container.offsetHeight;

              const canvas = document.createElement('canvas');
              canvas.width = cropArea.width * scaleX;
              canvas.height = cropArea.height * scaleY;
              const ctx = canvas.getContext('2d');

              if (ctx) {
                ctx.drawImage(
                  img,
                  cropArea.x * scaleX,
                  cropArea.y * scaleY,
                  cropArea.width * scaleX,
                  cropArea.height * scaleY,
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );

                const croppedImageUrl = canvas.toDataURL('image/png');
                setSelectedImage(croppedImageUrl);
                setPosition({ x: 0, y: 0 });
                setRotation(0);
              }

              setCropArea(null);
            }}
            onCropCancel={() => {
              setCropArea(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
