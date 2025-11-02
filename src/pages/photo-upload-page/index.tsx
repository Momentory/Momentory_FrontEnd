import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import ColorPickerModal from '../../components/PhotoUpload/ColorPickerModal';
import MapMarkerSection from '../../components/PhotoUpload/MapMarkerSection';
import { extractGPSFromImage, reverseGeocode } from '../../utils/imageMetadata';
import { useMarkerStore } from '../../stores/markerStore';
import { gpsToMapPosition, extractCityName } from '../../utils/mapCoordinates';
import marker1 from '../../assets/map-marker1.svg';

export default function PhotoUploadPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedImageFromState = location.state?.selectedImage as
    | string
    | undefined;
  const cameraStreamRequest = location.state?.cameraStream as
    | boolean
    | undefined;

  const [selectedImage, setSelectedImage] = useState<string | null>(
    selectedImageFromState || null
  );
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [markerColor, setMarkerColor] = useState('#FFB7B7');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [markerLocation, setMarkerLocation] = useState({
    address: '부천시 역곡동',
    lat: 37.5665,
    lng: 126.978,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleCameraOpen = useCallback(async () => {
    if (showCamera || stream) {
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });

      setStream(mediaStream);
      setShowCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      alert('카메라 접근에 실패했습니다. 권한을 확인해주세요.');
      navigate('/home');
    }
  }, [showCamera, stream, navigate]);

  const handleCameraClose = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    navigate('/home');
  }, [stream, navigate]);

  const handleCapture = () => {
    if (!videoRef.current || !stream) {
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');

    const width = video.videoWidth || video.clientWidth || 1280;
    const height = video.videoHeight || video.clientHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    try {
      ctx.drawImage(video, 0, 0, width, height);
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setShowCamera(false);
      setSelectedImage(imageUrl);
    } catch (error) {
      alert('사진 촬영에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const addMarker = useMarkerStore((state) => state.addMarker);

  const handleNext = () => {
    const imageToSend = selectedImageFromState || selectedImage;
    if (!imageToSend) {
      return;
    }

    const cityName = extractCityName(markerLocation.address);
    const position = gpsToMapPosition(markerLocation.lat, markerLocation.lng);

    if (cityName) {
      addMarker({
        top: position.top,
        left: position.left,
        image: marker1,
        location: cityName,
        lat: markerLocation.lat,
        lng: markerLocation.lng,
        color: markerColor,
      });
    }

    navigate('/photo-edit', { state: { imageUrl: imageToSend } });
  };

  const displayImage = selectedImageFromState || selectedImage;

  useEffect(() => {
    if (selectedImageFromState && selectedImageFromState !== selectedImage) {
      setSelectedImage(selectedImageFromState);
    }
  }, [selectedImageFromState, selectedImage]);

  useEffect(() => {
    const extractGPS = async () => {
      const image = displayImage;
      if (!image) return;

      const gpsLocation = await extractGPSFromImage(image);

      if (gpsLocation) {
        let address = '위치 정보 없음';
        try {
          const geocodedAddress = await reverseGeocode(
            gpsLocation.lat,
            gpsLocation.lng
          );
          if (geocodedAddress) {
            address = geocodedAddress;
            const koreanMatch = geocodedAddress.match(/대한민국\s*(.+)/);
            if (koreanMatch) {
              address = koreanMatch[1].trim();
            }
          }
        } catch (error) {
          // 주소 변환 실패 시 GPS 좌표만 사용
        }

        setMarkerLocation({
          address,
          lat: gpsLocation.lat,
          lng: gpsLocation.lng,
        });
      }
    };

    if (displayImage) {
      extractGPS();
    }
  }, [displayImage]);

  useEffect(() => {
    const cameraRequest = location.state?.cameraStream === true;

    if (!cameraRequest) {
      return;
    }

    if (displayImage) {
      return;
    }

    if (showCamera || stream) {
      return;
    }

    handleCameraOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, location.state?.cameraStream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (!displayImage && !showCamera && !cameraStreamRequest) {
      const timer = setTimeout(() => {
        navigate('/home', { replace: true });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [displayImage, showCamera, cameraStreamRequest, navigate]);

  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="flex-1 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 flex justify-center items-center gap-4 z-[101]">
        <button
            onClick={handleCameraClose}
            className="px-6 py-3 bg-gray-600 text-white rounded-full font-medium shadow-lg"
        >
            취소
        </button>
          <button
            onClick={handleCapture}
            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 active:scale-95 transition shadow-lg"
          />
        </div>
      </div>
    );
  }

  if (!displayImage && !showCamera) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">사진을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <DropdownHeader
        title="Photo Upload"
        hasDropdown={false}
        rightAction={
        <button
          onClick={handleNext}
            className="text-blue-500 font-semibold text-[15px]"
        >
          Next
        </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex justify-center p-6">
          <div
            className="w-[340px] bg-gray-100"
            style={{ aspectRatio: '340/290' }}
          >
          <img
              src={displayImage ?? undefined}
            alt="Selected"
              className="w-full h-full object-cover rounded-lg"
          />
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-base font-semibold mb-2">Introduction</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Photo Description..."
            className="w-full h-24 px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#E6D5D5]"
            style={{
              border: '2.5px solid #CECECE',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#E6D5D5';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#CECECE';
            }}
          />
        </div>

        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Visibility</h2>
            <p className="text-sm text-gray-600">Set to Private</p>
          </div>
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className="relative w-14 h-7 rounded-full transition-colors"
            style={{
              backgroundColor: isPrivate ? '#FF7070' : '#CECECE',
            }}
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                isPrivate ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <MapMarkerSection
          markerColor={markerColor}
          markerLocation={markerLocation}
          onMarkerClick={() => setShowColorPicker(true)}
        />
      </div>

      {showColorPicker && (
        <ColorPickerModal
          currentColor={markerColor}
          onColorChange={setMarkerColor}
          onClose={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
}
