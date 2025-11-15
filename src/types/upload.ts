import type { UploadPhotoResponse, NearbySpotsResponse } from './photo';

// 사진 업로드 플로우에서 공유하는 타입 정의
export type UploadCtx = {
  description: string;
  isPrivate: boolean;
  markerColor: string;
  markerLocation: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  cityName: string;
};

export interface UploadState {
  selectedImage?: string;
  uploadContext?: UploadCtx;
  uploadResult?: {
    imageName: string;
    imageUrl: string;
  };
  brightness?: number;
  contrast?: number;
  saturation?: number;
  filterIntensity?: number;
  selectedFilter?: string;
  rotation?: number;
  position?: { x: number; y: number };
  markerColor?: string;
  markerLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
}

export interface UploadSuccess {
  uploadResult: UploadPhotoResponse['result'];
  nearbySpots?: NearbySpotsResponse['result']['spots'];
}
