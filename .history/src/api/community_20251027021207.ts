import { api } from "./client"; 

// 게시글 등록
export const postCommunity = async (formData: FormData) => {
  const res = await api.post("/api/community", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 게시글 목록 조회 (추후 /community 페이지에서 사용)
export const getCommunityPosts = async () => {
  const res = await api.get("/api/community");
  return res.data;
};
