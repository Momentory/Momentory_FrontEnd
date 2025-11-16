import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function PhotoUploadSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/stamp-acquisition', {
        state: {
          ...location.state,
          // photoId와 nearbySpots가 확실히 포함되도록
          photoId: location.state?.photoId,
          nearbySpots: location.state?.nearbySpots,
        },
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-24 h-24 bg-[#FF7070] rounded-full flex items-center justify-center mb-6">
        <Check className="w-12 h-12 text-white" strokeWidth={3} />
      </div>
      <p className="text-2xl font-semibold text-gray-800">업로드 완료!</p>
    </div>
  );
}
