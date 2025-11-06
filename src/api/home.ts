import { api } from './client';

export const getTopPlaces = async () => {
  try {
    const res = await api.get('/api/home/travel-top3');
    console.log('[getTopPlaces] response:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error(
      '[getTopPlaces] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

export const getRecentPhotos = async () => {
  try {
    const res = await api.get('/api/home/recent-photos');
    console.log(' [getRecentPhotos] response:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error(
      ' [getRecentPhotos] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

export const getMapPreview = async () => {
  try {
    const res = await api.get('/api/home/map-preview');
    console.log('[getMapPreview] response:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error(
      '[getMapPreview] 실패:',
      error.response?.status,
      error.response?.data || error
    );
    throw error;
  }
};

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


