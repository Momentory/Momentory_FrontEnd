import { api } from "./client";

//  오늘의 여행지 Top3 조회
export const getTopPlaces = async () => {
  try {
    const res = await api.get("/api/home/travel-top3");
    return res.data; // [{ id, name, imageUrl, rating, reviewCount }, ...]
  } catch (error) {
    console.error("getTopPlaces() 실패:", error);
    return []; // 실패 시 빈 배열 반환
  }
};

// 최근 업로드 사진 3개 조회
export const getRecentPhotos = async () => {
  try {
    const res = await api.get("/api/home/recent-photos");
    return res.data; // [{ id, imageUrl }, ...]
  } catch (error) {
    console.error(" getRecentPhotos() 실패:", error);
    return [];
  }
};

// 지도 미리보기 조회
export const getMapPreview = async () => {
  try {
    const res = await api.get("/api/home/map-preview");
    return res.data; // { previewUrl: "..." }
  } catch (error) {
    console.error("getMapPreview() 실패:", error);
    return { previewUrl: null };
  }
};

// 모든 여행지 전체 조회 (임시 더미 데이터)
export const getAllPlaces = async () => {
  // 실제 API 완성 전에는 더미 데이터 반환
  return [
    {
      id: 1,
      name: "남한산성",
      location: "광주시 남한산성면",
      imageUrl: "/images/sample-place1.jpg",
      rating: 4.3,
      reviewCount: 213,
    },
    {
      id: 2,
      name: "수원화성",
      location: "수원시 팔달구",
      imageUrl: "/images/sample-place2.jpg",
      rating: 4.7,
      reviewCount: 541,
    },
    {
      id: 3,
      name: "아침고요수목원",
      location: "가평군 상면",
      imageUrl: "/images/sample-place3.jpg",
      rating: 4.8,
      reviewCount: 325,
    },
  ];
};
