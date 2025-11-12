import { api } from './client';

/* ----------------------------- 타입 정의 ----------------------------- */

// 사용자 프로필
export interface UserProfile {
  userId: number;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
  point: number;
  level: number;
  imageName: string | null;
  imageUrl: string | null;
  backgroundImageName: string | null;
  backgroundImageUrl: string | null;
  bio: string | null;
  externalLink: string | null;
  followerCount: number;
  followingCount: number;
}

// 사용자 프로필 요약
export interface UserProfileSummary {
  userId: number;
  email: string;
  name: string;
  nickname: string;
  imageUrl: string | null;
}

// 프로필 업데이트 요청
export interface UpdateProfileRequest {
  nickName?: string;
  imageName?: string;
  imageUrl?: string;
  backgroundImageName?: string;
  backgroundImageUrl?: string;
  bio?: string;
  externalLink?: string;
}

// 이미지 업로드 응답
export interface ImageUploadResult {
  imageName: string;
  imageUrl: string;
}

// API 응답 타입
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/* ----------------------------- 프로필 API ----------------------------- */

// 1. 내 프로필 조회
export const getMyProfile = async () => {
  try {
    const res = await api.get<ApiResponse<UserProfile>>('/api/mypage/profile');
    console.log('[getMyProfile] response:', res.data);
    return res.data.result;
  } catch (error: any) {
    console.error(
      '[getMyProfile] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 1-1. 내 프로필 요약 조회
export const getMyProfileSummary = async () => {
  try {
    const res = await api.get<ApiResponse<UserProfileSummary>>('/api/mypage/profile/summary');
    console.log('[getMyProfileSummary] response:', res.data);
    return res.data.result;
  } catch (error: any) {
    console.error(
      '[getMyProfileSummary] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 2. 프로필 업데이트
export const updateProfile = async (data: UpdateProfileRequest) => {
  try {
    const res = await api.put<ApiResponse<UserProfile>>(
      '/api/mypage/profile',
      data
    );
    console.log('[updateProfile] response:', res.data);
    return res.data.result;
  } catch (error: any) {
    console.error(
      '[updateProfile] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 3. 이미지 업로드
export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post<ApiResponse<ImageUploadResult>>(
      '/api/image/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('[uploadImage] response:', res.data);
    return res.data.result;
  } catch (error: any) {
    console.error(
      '[uploadImage] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 4. 회원 탈퇴
export const deleteAccount = async () => {
  try {
    const res = await api.delete<ApiResponse<string>>('/api/mypage');
    console.log('[deleteAccount] response:', res.data);
    return res.data.result;
  } catch (error: any) {
    console.error(
      '[deleteAccount] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};
