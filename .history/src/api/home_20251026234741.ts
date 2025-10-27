import { api } from "./client";

// 오늘의 여행지 Top3 조회
export const getTopPlaces = async () => {
  const res = await api.get("/api/home/travel-top3");
  return res.data;
};

// 최근 업로드 사진 3개 조회
export const getRecentPhotos = async () => {
  const res = await api.get("/api/home/recent-photos");
  return res.data;
};

// 지도 미리보기 조회
export const getMapPreview = async () => {
  const res = await api.get("/api/home/map-preview");
  return res.data;
};

// ✅ 모든 여행지 전체 조회 (임시)
export const getAllPlaces = async () => {
  return [
    {
      id: 1,
      name: "남한산성",
      location: "광주시 남한산성면",
      imageUrl: "/images/sample-place1.jpg",
    },
    {
      id: 2,
      name: "수원화성",
      location: "수원시 팔달구",
      imageUrl: "/images/sample-place2.jpg",
    },
    {
      id: 3,
      name: "아침고요수목원",
      location: "가평군 상면",
      imageUrl: "/images/sample-place3.jpg",
    },
  ];
};
