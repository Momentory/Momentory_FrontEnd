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
    const res = await api.get<ApiResponse<AlbumListItem[]>>('/api/mypage/albums');
    return res.data;
  },

  // 앨범 상세 조회
  async getAlbumDetail(albumId: number): Promise<ApiResponse<AlbumDetail>> {
    const res = await api.get<ApiResponse<AlbumDetail>>(`/api/mypage/albums/${albumId}`);
    return res.data;
  },

  // 앨범 생성
  async createAlbum(data: CreateAlbumRequest): Promise<ApiResponse<CreateAlbumResponse>> {
    const res = await api.post<ApiResponse<CreateAlbumResponse>>('/api/mypage/albums', data);
    return res.data;
  },

  // 앨범 수정
  async updateAlbum(
    albumId: number,
    data: UpdateAlbumRequest
  ): Promise<ApiResponse<UpdateAlbumResponse>> {
    const res = await api.patch<ApiResponse<UpdateAlbumResponse>>(
      `/api/mypage/albums/${albumId}`,
      data
    );
    return res.data;
  },
};
