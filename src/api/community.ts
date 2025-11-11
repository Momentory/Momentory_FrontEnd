import { api } from './client';

/* ----------------------------- 게시글 관련 ----------------------------- */

// 게시글 목록 조회
export const getCommunityPosts = async () => {
  const res = await api.get("/api/community/posts");
  return res.data.result.posts; // posts 배열만 반환
};

// 게시글 상세 조회
export const getCommunityPostDetail = async (postId: number) => {
  const res = await api.get(`/api/community/posts/${postId}`);
  return res.data;
};

// 게시글 작성 (이미지 포함)
export const postCommunity = async (formData: FormData) => {
  const res = await api.post("/api/community", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 게시글 수정
export const updateCommunityPost = async (postId: number, payload: any) => {
  const res = await api.put(`/api/community/posts/${postId}`, payload);
  return res.data;
};

// 게시글 삭제
export const deleteCommunityPost = async (postId: number) => {
  const res = await api.delete(`/api/community/posts/${postId}`);
  return res.data;
};

/* ----------------------------- 댓글 관련 ----------------------------- */

// 댓글 목록 조회
export const getComments = async (postId: number) => {
  const res = await api.get(`/api/community/posts/${postId}/comments`);
  return res.data;
};

// 댓글 등록
export const postComment = async (postId: number, content: string) => {
  const res = await api.post(`/api/community/posts/${postId}/comments`, {
    content,
  });
  return res.data;
};

// 댓글 수정
export const updateComment = async (commentId: number, content: string) => {
  const res = await api.put(`/api/community/posts/comments/${commentId}`, {
    content,
  });
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (commentId: number) => {
  const res = await api.delete(`/api/community/posts/comments/${commentId}`);
  return res.data;
};

/* ----------------------------- 게시글 반응 ----------------------------- */

// 좋아요 토글
export const toggleLike = async (postId: number) => {
  const res = await api.post(`/api/community/posts/${postId}/like`);
  return res.data;
};

// 스크랩 토글
export const toggleScrap = async (postId: number) => {
  const res = await api.post(`/api/community/posts/${postId}/scrap`);
  return res.data;
};

/* ----------------------------- 조회 관련 ----------------------------- */

// 지역별 게시글 조회
export const getPostsByRegion = async (regionId: number) => {
  const res = await api.get(`/api/community/posts/region/${regionId}`);
  return res.data;
};

// 태그별 게시글 조회
export const getPostsByTag = async (tagName: string) => {
  const res = await api.get(`/api/community/posts/tag/${tagName}`);
  return res.data;
};

// 게시글 검색
export const searchPosts = async (keyword: string) => {
  const res = await api.get(`/api/community/posts/search`, {
    params: { keyword },
  });
  return res.data;
};

/* ----------------------------- 팔로우 ----------------------------- */

// 팔로우 등록
export const followUser = async (userId: number) => {
  const res = await api.post(`/api/community/follow/${userId}`);
  return res.data;
};

// 팔로우 해제
export const unfollowUser = async (userId: number) => {
  const res = await api.delete(`/api/community/follow/${userId}`);
  return res.data;
};

/* ----------------------------- 내 활동 ----------------------------- */

// 내가 쓴 글 조회
export const getMyPosts = async () => {
  const res = await api.get(`/api/community/users/me/posts`);
  return res.data;
};

// 내가 단 댓글 조회
export const getMyComments = async () => {
  const res = await api.get(`/api/community/users/me/comments`);
  return res.data;
};

// 내가 스크랩한 게시글 조회
export const getMyScraps = async () => {
  const res = await api.get(`/api/community/users/me/scraps`);
  return res.data;
};
