import { api } from "./client";

// 게시글 목록 불러오기
export const getCommunityPosts = async () => {
  const res = await api.get("/api/community");
  return res.data;
};

// 게시글 상세 불러오기
export const getCommunityPostDetail = async (postId: number) => {
  const res = await api.get(`/api/community/${postId}`);
  return res.data;
};

// 게시글 작성 (이미지 포함)
export const postCommunity = async (formData: FormData) => {
  const res = await api.post("/api/community", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 댓글 등록
export const postComment = async (postId: number, content: string) => {
  const res = await api.post(`/api/community/${postId}/comments`, { content });
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (commentId: number) => {
  const res = await api.delete(`/api/community/comments/${commentId}`);
  return res.data;
};

//  좋아요 토글
export const toggleLike = async (postId: number) => {
  const res = await api.put(`/api/community/${postId}/like`);
  return res.data;
};

// 스크랩 토글
export const toggleScrap = async (postId: number) => {
  const res = await api.put(`/api/community/${postId}/scrap`);
  return res.data;
};

// 팔로우 등록
export const followUser = async (userId: number) => {
  const res = await api.post(`/api/community/follow/${userId}`);
  return res.data;
};

//  팔로우 해제
export const unfollowUser = async (userId: number) => {
  const res = await api.delete(`/api/community/follow/${userId}`);
  return res.data;
};
