import { api } from './client';

// 파일 업로드 응답 타입
export interface UploadFileResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    imageName: string;
    imageUrl: string;
  };
}

// 파일 삭제 응답 타입
export interface DeleteFileResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

/**
 * S3에 파일 업로드
 * @param file 업로드할 파일
 * @returns 업로드된 파일 정보 (imageName, imageUrl)
 */
export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await api.post<UploadFileResponse>(
      '/api/image/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data;
  } catch (error) {
    console.error('S3 파일 업로드 실패', error);
    throw error;
  }
};

/**
 * S3에서 파일 삭제
 * @param imageName 삭제할 파일 이름 (S3 키 또는 파일명)
 * @returns 삭제 결과
 */
export const deleteFile = async (
  imageName: string
): Promise<DeleteFileResponse> => {
  try {
    const res = await api.delete<DeleteFileResponse>(`/api/image/${imageName}`);
    return res.data;
  } catch (error) {
    console.error('S3 파일 삭제 실패', error);
    throw error;
  }
};


