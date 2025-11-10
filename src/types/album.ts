export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface AlbumImage {
  imageName: string;
  imageUrl: string;
  index: number;
}

export interface AlbumListItem {
  id: number;
  title: string;
  imageCount: number;
  thumbnailUrl: string;
  createdAt: string;
  shared: boolean;
}

export interface AlbumDetail {
  id: number;
  title: string;
  images: AlbumImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlbumRequest {
  title: string;
  images: AlbumImage[];
}

export interface CreateAlbumResponse {
  id: number;
  title: string;
}

export interface UpdateAlbumRequest {
  title?: string;
  images?: AlbumImage[];
}

export interface UpdateAlbumResponse {
  id: number;
  title: string;
}

export interface MyPhoto {
  photoId: number;
  imageName: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  memo: string;
  visibility: string;
  createdAt: string;
}

export interface MyPhotosResponse {
  photos: MyPhoto[];
  nextCursor: string;
  hasNext: boolean;
}