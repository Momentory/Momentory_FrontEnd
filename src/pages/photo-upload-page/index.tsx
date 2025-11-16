import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import ColorPickerModal from '../../components/PhotoUpload/ColorPickerModal';
import MapMarkerSection from '../../components/PhotoUpload/MapMarkerSection';
import { extractGPSFromImage } from '../../utils/imageMetadata';
import { useMarkerStore } from '../../stores/markerStore';
import { gpsToMapPosition, extractCityName } from '../../utils/mapCoordinates';
import marker1 from '../../assets/map-marker1.svg';
import { useLocationToAddress } from '../../hooks/photo/usePhotoQueries';
import { uploadFile } from '../../api/S3';

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
  const [uploadedInfo, setUploadedInfo] = useState<{
    imageName: string;
    imageUrl: string;
  } | null>(location.state?.uploadResult ?? null);
  const [isUploadingS3, setIsUploadingS3] = useState(false);
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [markerColor, setMarkerColor] = useState('#FFB7B7');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [markerLocation, setMarkerLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

  const handleCapture = async () => {
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
      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.9)
        );

        if (!blob) {
          throw new Error('이미지 변환 실패');
        }

        const fileName = `camera-${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        setUploadedInfo(null);
        setIsUploadingS3(true);
        try {
          const uploadResponse = await uploadFile(file);
          setUploadedInfo(uploadResponse.result);
        } catch (uploadError) {
          console.error(uploadError);
          alert('사진을 업로드하지 못했습니다. 다시 시도해주세요.');
        } finally {
          setIsUploadingS3(false);
        }
        setGpsCoords(null);
      } catch (error) {
        console.error(error);
        alert('사진 파일을 생성하지 못했습니다. 다시 시도해주세요.');
      }
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

    // GPS 정보가 있을 때만 마커 추가
    if (markerLocation) {
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
    }

    if (!uploadedInfo || isUploadingS3) {
      alert('이미지를 업로드하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    console.log('Navigating to /photo-edit with state:', {
      imageUrl: imageToSend,
      uploadResult: uploadedInfo,
      uploadContext: {
        description,
        isPrivate,
        markerColor,
        markerLocation,
        cityName: markerLocation ? extractCityName(markerLocation.address) || '미확인' : '미확인',
      },
    });

    navigate('/photo-edit', {
      state: {
        imageUrl: imageToSend,
        uploadResult: uploadedInfo,
        uploadContext: {
          description,
          isPrivate,
          markerColor,
          markerLocation,
          cityName: markerLocation ? extractCityName(markerLocation.address) || '미확인' : '미확인',
        },
      },
    });
  };

  const displayImage = selectedImageFromState || selectedImage;

  const { data: locationAddressData, isFetching: isLocationFetching } =
    useLocationToAddress(gpsCoords?.lat, gpsCoords?.lng, {
      enabled: Boolean(gpsCoords),
      staleTime: 1000 * 60 * 5,
    });

  useEffect(() => {
    if (!locationAddressData?.result) {
      return;
    }
    setMarkerLocation((prev) => ({
      ...prev,
      address: locationAddressData.result.address,
      lat: locationAddressData.result.latitude,
      lng: locationAddressData.result.longitude,
      cityName: locationAddressData.result.cityName,
    }));
  }, [locationAddressData]);

  useEffect(() => {
    if (selectedImageFromState && selectedImageFromState !== selectedImage) {
      setSelectedImage(selectedImageFromState);
    }
  }, [selectedImageFromState, selectedImage]);

  useEffect(() => {
    if (location.state?.uploadResult) {
      setUploadedInfo(location.state.uploadResult);
    }
  }, [
    location.state?.uploadResult?.imageName,
    location.state?.uploadResult?.imageUrl,
  ]);

  useEffect(() => {
    const extractGPS = async () => {
      const image = displayImage;
      if (!image) return;

      const gpsLocation = await extractGPSFromImage(image);

      if (gpsLocation) {
        // GPS 좌표를 설정하면 API 호출이 자동으로 일어남
        setGpsCoords({ lat: gpsLocation.lat, lng: gpsLocation.lng });
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
        title="사진 업로드"
        hasDropdown={false}
        rightAction={
          <button
            type="button"
            onClick={handleNext}
            disabled={isLocationFetching}
            className={`text-[15px] font-semibold ${
              isLocationFetching
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-500'
            }`}
          >
            다음
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex justify-center p-6">
          <div
            className="w-[340px] bg-gray-100 relative"
            style={{ aspectRatio: '340/290' }}
          >
            <img
              src={displayImage ?? undefined}
              alt="선택된 사진"
              className="w-full h-full object-cover rounded-lg"
            />
            {isUploadingS3 && (
              <div className="absolute inset-0 rounded-lg bg-white/70 backdrop-blur-[1px] flex items-center justify-center text-sm font-semibold text-[#A47272]">
                S3 업로드 중...
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-5">
          <div className="w-full max-w-[420px]">
            <div className="border-t-2" style={{ borderColor: '#E6D5D5' }} />
          </div>
        </div>

        <div className="flex justify-center px-6">
          <div className="w-full max-w-[400px]">
            <div className="mb-4 pt-4">
              <h2 className="text-[18px] font-semibold mb-2">소개</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="사진 설명을 입력하세요..."
                className="w-full h-24 px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#E6D5D5] placeholder:text-[16px]"
                style={{
                  border: '2px solid #CECECE',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E6D5D5';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#CECECE';
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-5">
          <div className="w-full max-w-[420px]">
            <div className="border-t-2" style={{ borderColor: '#E6D5D5' }} />
          </div>
        </div>

        <div className="flex justify-center px-6">
          <div className="w-full max-w-[400px]">
            <div className="py-3 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-semibold mb-2">공개 설정</h2>
                <p className="text-sm text-gray-600 pl-2">비공개로 설정</p>
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
          </div>
        </div>

        <div className="flex justify-center mb-5">
          <div className="w-full max-w-[420px]">
            <div className="border-t-2" style={{ borderColor: '#E6D5D5' }} />
          </div>
        </div>

        <div className="flex justify-center px-6">
          <div className="w-full max-w-[400px]">
            <MapMarkerSection
              markerColor={markerColor}
              markerLocation={markerLocation}
              onMarkerClick={() => setShowColorPicker(true)}
            />
          </div>
        </div>

        <div className="flex justify-center mb-5 mt-5">
          <div className="w-full max-w-[420px]">
            <div className="border-t-2" style={{ borderColor: '#E6D5D5' }} />
          </div>
        </div>

        <div className="flex justify-center px-6">
          <div className="w-full max-w-[400px]">
            <div className="mb-4 pt-4">
              <h2 className="text-[18px] font-semibold mb-4 text-orange-600">
                🧪 테스트용 GPS 좌표 입력
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    위도 (Latitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={markerLocation?.lat ?? ''}
                    onChange={(e) =>
                      setMarkerLocation((prev) => ({
                        address: prev?.address ?? '',
                        lat: parseFloat(e.target.value) || 0,
                        lng: prev?.lng ?? 0,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-400 text-sm"
                    placeholder="37.5034"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    경도 (Longitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={markerLocation?.lng ?? ''}
                    onChange={(e) =>
                      setMarkerLocation((prev) => ({
                        address: prev?.address ?? '',
                        lat: prev?.lat ?? 0,
                        lng: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-400 text-sm"
                    placeholder="126.766"
                  />
                </div>
              </div>
              <button
                onClick={() =>
                  markerLocation && setGpsCoords({
                    lat: markerLocation.lat,
                    lng: markerLocation.lng,
                  })
                }
                className="mt-3 w-full px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors text-sm"
              >
                주소 변환하기
              </button>
              <p className="text-xs text-gray-500 mt-2">
                💡 부천시: 37.5034, 126.766 / 수원시: 37.2636, 127.0286
              </p>
            </div>
          </div>
        </div>
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
