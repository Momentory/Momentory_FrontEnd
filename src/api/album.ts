import { api } from './client';
import type {
  ApiResponse,
  AlbumListItem,
  AlbumDetail,
  CreateAlbumRequest,
  CreateAlbumResponse,
  UpdateAlbumRequest,
  UpdateAlbumResponse,
} from '../types/album';

export const album = {
  // 내 앨범 목록 조회
  async getMyAlbums(): Promise<ApiResponse<AlbumListItem[]>> {
    const res = await api.get<ApiResponse<AlbumListItem[]>>('/mypage/albums');
    return res.data;
  },

  // 앨범 상세 조회
  async getAlbumDetail(albumId: number): Promise<ApiResponse<AlbumDetail>> {
    const res = await api.get<ApiResponse<AlbumDetail>>(`/mypage/albums/${albumId}`);
    return res.data;
  },

  // 앨범 생성
  async createAlbum(data: CreateAlbumRequest): Promise<ApiResponse<CreateAlbumResponse>> {
    const res = await api.post<ApiResponse<CreateAlbumResponse>>('/mypage/albums', data);
    return res.data;
  },

  // 앨범 수정
  async updateAlbum(
    albumId: number,
    data: UpdateAlbumRequest
  ): Promise<ApiResponse<UpdateAlbumResponse>> {
    const res = await api.patch<ApiResponse<UpdateAlbumResponse>>(
      `/mypage/albums/${albumId}`,
      data
    );
    return res.data;
  },

  // 이미지 다건 업로드
  async uploadImages(imageBlobs: { blob: Blob; name: string }[]): Promise<ApiResponse<{ imageName: string; imageUrl: string }[]>> {
    const formData = new FormData();

    imageBlobs.forEach((image) => {
      formData.append('images', image.blob, `${image.name}.jpg`);
    });

    const res = await api.post<ApiResponse<{ imageName: string; imageUrl: string }[]>>('/image/upload/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // 앨범 공유 링크 생성
  async createShareLink(albumId: number): Promise<ApiResponse<{ shareUrl: string }>> {
    const res = await api.post<ApiResponse<{ shareUrl: string }>>(`/albums/${albumId}/share`);
    return res.data;
  },

  // 앨범 공유 해제
  async unshareAlbum(albumId: number): Promise<ApiResponse<{}>> {
    const res = await api.patch<ApiResponse<{}>>(`/albums/${albumId}/unshare`);
    return res.data;
  },

  // 공유 앨범 조회 (비로그인 접근 가능)
  async getSharedAlbum(shareUuid: string): Promise<ApiResponse<{ title: string; images: { imageUrl: string; index: number }[] }>> {
    const res = await api.get<ApiResponse<{ title: string; images: { imageUrl: string; index: number }[] }>>(`/albums/share/${shareUuid}`);
    return res.data;
  },
};
