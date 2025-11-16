import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import type { MyPhoto } from '../../types/album';
import MapIcon from '../../assets/icons/mapIcon.svg?react';
import { useDeletePhotoMutation } from '../../hooks/photo/usePhotoMutations';
import { useQueryClient } from '@tanstack/react-query';

interface PhotoDetailModalProps {
  photo: MyPhoto | null;
  onClose: () => void;
  onDelete?: () => void;
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  onClose,
  onDelete,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 0, y: 0 });
  const [lightOpacity, setLightOpacity] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const queryClient = useQueryClient();

  const deletePhotoMutation = useDeletePhotoMutation(photo?.photoId || 0, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPhotos'] });
      onDelete?.();
      onClose();
    },
    onError: (error) => {
      console.error('사진 삭제 실패:', error);
      alert('사진 삭제에 실패했습니다.');
    },
  });

  if (!photo) return null;

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!photo) return;
    deletePhotoMutation.mutate();
    setShowConfirmDialog(false);
  };

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
          className="bg-white p-4 pb-16 transition-all duration-300 ease-out relative overflow-visible"
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

          {/* 삭제 버튼 - 우측 하단 */}
          <button
            onClick={handleDeleteClick}
            disabled={deletePhotoMutation.isPending}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-gray-400 disabled:opacity-50 z-10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deletePhotoMutation.isPending ? '삭제 중...' : '삭제'}</span>
          </button>
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[600] px-5">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg px-6 py-6">
            <h2 className="text-lg font-bold text-center mb-2">사진 삭제</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              이 사진을 삭제하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-3 px-4 rounded-lg bg-[#EAEAEA] text-[#8D8D8D] font-medium hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletePhotoMutation.isPending}
                className="flex-1 py-3 px-4 rounded-lg bg-[#FF7070] text-white font-medium hover:bg-[#ff6060] transition-colors disabled:opacity-50"
              >
                {deletePhotoMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PhotoDetailModal;
