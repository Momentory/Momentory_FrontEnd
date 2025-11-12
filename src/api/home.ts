import { api } from './client';

/* ----------------------------- 홈 화면 API ----------------------------- */

// 오늘의 여행지 Top 3
export const getTopPlaces = async () => {
  try {
    const res = await api.get('/api/home/travel-top3');
    return res.data.data; // .data.data가 맞는지 확인 필요 (이하 동일)
  } catch (error: any) {
    console.error(
      '[getTopPlaces] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 최신 업로드 사진 3개
export const getRecentPhotos = async () => {
  try {
    const res = await api.get('/api/home/recent-photos');
    return res.data.data;
  } catch (error: any) {
    console.error(
      '[getRecentPhotos] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 나의 캐릭터 현황 (토큰 필요)
export const getCharacterStatus = async () => {
  try {
    const res = await api.get('/api/home/character-status');
    return res.data.data;
  } catch (error: any) {
    console.error(
      '[getCharacterStatus] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 다가오는 이벤트
export const getEvents = async () => {
  try {
    const res = await api.get('/api/home/events');
    return res.data.data;
  } catch (error: any) {
    console.error(
      '[getEvents] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

// 내 포인트 조회 (API 문서 기반으로 /api/point로 수정)
export const getMyPoint = async () => {
  try {
    const res = await api.get('/api/point');
    return res.data.data; // API 응답 구조에 따라 .data가 맞을 수 있음
  } catch (error: any) {
    console.error(
      '[getMyPoint] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

//나의 지도 - 방문 지역 색깔 정보
export const getMyMapInfo = async () => {
  try {
    const res = await api.get('/api/map/my');
    return res.data.data; // API 응답 구조에 따라 .data가 맞을 수 있음
  } catch (error: any) {
    console.error(
      '[getMyMapInfo] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

/* ----------------------------- 샘플 데이터 (임시용) ----------------------------- */

export const getAllPlaces = async () => {
  return [
    {
      id: 1,
      name: '남한산성',
      location: '광주시 남한산성면',
      imageUrl: '/images/sample-place1.jpg',
    },
    {
      id: 2,
      name: '수원화성',
      location: '수원시 팔달구',
      imageUrl: '/images/sample-place2.jpg',
    },
    {
      id: 3,
      name: '아침고요수목원',
      location: '가평군 상면',
      imageUrl: '/images/sample-place3.jpg',
    },
  ];
};
