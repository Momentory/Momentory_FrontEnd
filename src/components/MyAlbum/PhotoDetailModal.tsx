import { useState } from 'react';
import Modal from '../common/Modal';
import type { MyPhoto } from '../../types/album';
import MapIcon from '../../assets/icons/mapIcon.svg?react';

interface PhotoDetailModalProps {
  photo: MyPhoto | null;
  onClose: () => void;
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  onClose,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 0, y: 0 });
  const [lightOpacity, setLightOpacity] = useState(0);

  if (!photo) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPosition({ x, y });

    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    setLightPosition({ x: localX, y: localY });
    setLightOpacity(1);
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setLightOpacity(0);
  };

  return (
    <Modal title="" onClose={onClose}>
      <div className="flex justify-center items-center p-4">
        <div
          className="bg-white p-4 pb-16 transition-all duration-300 ease-out relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            maxWidth: '500px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)',
            transform: `perspective(1000px) rotateX(${-position.y * 5}deg) rotateY(${position.x * 5}deg)`,
          }}
        >
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: lightOpacity,
              background: `radial-gradient(circle 300px at ${lightPosition.x}px ${lightPosition.y}px, rgba(255, 255, 255, 0.35), transparent 80%)`,
              pointerEvents: 'none',
              mixBlendMode: 'overlay',
            }}
          />

          <div className="bg-gray-100 mb-4" style={{ aspectRatio: '4/3' }}>
            <img
              src={photo.imageUrl}
              alt={photo.memo || '사진'}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="px-2 space-y-3">
            {photo.memo && (
              <p className="text-gray-800 text-center font-handwriting text-lg leading-relaxed">
                {photo.memo}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-200">
              {photo.address && (
                <div className="flex items-center gap-1">
                  <MapIcon className="w-3.5 h-3.5 opacity-70" />
                  <span
                    className="text-xs truncate max-w-[200px]"
                    title={photo.address}
                  >
                    {photo.address}
                  </span>
                </div>
              )}

              <div className="text-xs text-gray-500 ml-auto">
                {formatDate(photo.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PhotoDetailModal;
