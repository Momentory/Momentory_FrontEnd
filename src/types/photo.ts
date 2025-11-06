// 사진 업로드 요청 타입
export interface UploadPhotoRequest {
  imageName: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  cityName: string;
  color: string;
  visibility: boolean;
  memo: string;
}

// 사진 업로드 응답 타입
export interface UploadPhotoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    photoId: number;
    imageName: string;
    imageUrl: string;
    regionalStampGranted: boolean;
    regionalStampName: string;
    hasNearbyCulturalSpots: boolean;
    nearbyCulturalSpotName: string;
    rouletteRewardGranted: boolean;
    rouletteRewardPoint: number;
  };
}

// 위치 정보 응답 타입
export interface LocationToAddressResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    latitude: number;
    longitude: number;
    address: string;
    cityName: string;
  };
}

// 사진 조회 응답 타입
export interface PhotoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    photoId: number;
    imageName: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    address: string;
    memo: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    createdAt: string;
  };
}

// 사진 수정 요청 타입
export interface UpdatePhotoRequest {
  address?: string;
  memo?: string;
  visibility?: boolean;
}

// 사진 공개 여부 변경 응답 타입
export interface UpdatePhotoVisibilityResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    photoId: number;
    imageName: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    address: string;
    memo: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    createdAt: string;
  };
}

// 근처 관광지 추천 응답 타입
export interface NearbySpotsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    photoId: number;
    latitude: number;
    longitude: number;
    address: string;
    regionName: string;
    spots: Array<{
      name: string;
      type: string;
      region: string;
      address: string;
      tel: string;
      imageUrl: string;
    }>;
  };
}

// 사진 삭제 응답 타입
export interface DeletePhotoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

