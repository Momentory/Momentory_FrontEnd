import { api } from './client';

/* -------------------------------------------------------------------------- */
/*                                   타입들                                   */
/* -------------------------------------------------------------------------- */

/* ----------------------------- 게시글 타입 ----------------------------- */
export interface CommunityPost {
  postId: number;
  userId: number;
  userNickname: string;
  userProfileImageUrl: string | null;
  userProfileImageName?: string | null;
  title: string;
  time?: string;
  content: string;
  thumbnailUrl?: string;
  imageUrl?: string | null;
  imageName?: string | null;
  regionId?: number;
  regionName?: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt?: string;
  updatedAt?: string;
  scrapStatus?: boolean;
  liked?: boolean;
}

// /* ---------------------- 서버 응답 타입 (전체 조회용) ---------------------- */
// interface PageableResponse<T> {
//   content: T[];
// }

interface GetPostsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    posts: CommunityPost[];
  };
}

/* -------------------------------------------------------------------------- */
/*                                게시글 API                                 */
/* -------------------------------------------------------------------------- */

/* ----------------------------- 전체 게시글 조회 ----------------------------- */
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  try {
    const res = await api.get<GetPostsResponse>('/api/community/posts');
    const posts = res.data?.result?.posts ?? [];

    return posts.map((p) => ({
      ...p,
      imageUrl: p.imageUrl === 'string' ? null : p.imageUrl,
      userProfileImageUrl:
        p.userProfileImageUrl === 'string' ? null : p.userProfileImageUrl,
    }));
  } catch (err) {
    console.error('전체 게시글 조회 실패:', err);
    return [];
  }
};

/* ----------------------------- 게시글 상세 조회 ----------------------------- */
export const getCommunityPostDetail = async (postId: number) => {
  try {
    const res = await api.get(`/api/community/posts/${postId}`);
    const data = res.data?.result;

    if (!data) return null;

    return {
      ...data,
      imageUrl: data.imageUrl === 'string' ? null : data.imageUrl,
      userProfileImageUrl:
        data.userProfileImageUrl === 'string' ? null : data.userProfileImageUrl,
    };
  } catch (err) {
    console.error(`게시글 상세 조회 실패(postId=${postId})`, err);
    return null;
  }
};

/* ----------------------------- 게시글 작성 (JSON) ----------------------------- */
export interface CommunityPostPayload {
  title: string;
  content: string;
  imageUrl: string;
  imageName: string;
  regionId: number;
  tags: string[];
}

export const postCommunity = async (payload: CommunityPostPayload) => {
  try {
    const res = await api.post('/api/community/posts', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  } catch (err) {
    console.error('게시글 작성 실패:', err);
    throw err;
  }
};

/* ----------------------------- 게시글 작성 (FormData) ----------------------------- */
export const postCommunityFormData = async (formData: FormData) => {
  try {
    const res = await api.post('/api/community/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    console.error('게시글 작성 실패(FormData):', err);
    throw err;
  }
};

/* ----------------------------- 게시글 삭제 ----------------------------- */
export const deletePost = async (postId: number) => {
  try {
    const res = await api.delete(`/api/community/posts/${postId}`);
    return res.data?.result;
  } catch (err: any) {
    console.error(`게시글 삭제 실패(postId=${postId})`, err);

    //  실제 요청 URL 출력
    if (err.config) {
      console.log(' 실제 요청 URL:', err.config.url);
      console.log(' 요청 method:', err.config.method);
    }

    // 백엔드에서 준 에러 메시지 출력
    if (err.response) {
      console.log(' 서버 응답:', err.response.data);
      console.log(' status:', err.response.status);
    }

    throw err;
  }
};

/* ----------------------------- 게시글 수정 ----------------------------- */
export const updatePost = async (
  postId: number,
  payload: CommunityPostPayload
) => {
  try {
    const res = await api.put(`/api/community/posts/${postId}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data?.result;
  } catch (err) {
    console.error('게시글 수정 실패:', err);
    throw err;
  }
};

/* ----------------------------- 좋아요 / 스크랩 ----------------------------- */
export const toggleLike = async (postId: number) => {
  try {
    const res = await api.post(`/api/community/posts/${postId}/like`);
    return res.data;
  } catch (err) {
    console.error('좋아요 실패:', err);
    throw err;
  }
};

export const toggleScrap = async (postId: number) => {
  try {
    const res = await api.post(`/api/community/posts/${postId}/scrap`);
    return res.data;
  } catch (err) {
    console.error('스크랩 실패:', err);
    throw err;
  }
};

/* ----------------------------- 지역별 게시글 조회 ----------------------------- */
export const getPostsByRegion = async (regionId: number) => {
  try {
    const res = await api.get(`/api/community/posts/region/${regionId}`);
    return res.data?.result?.posts ?? [];
  } catch (err) {
    console.error('지역별 게시글 조회 실패:', err);
    throw err;
  }
};

/* -------------------------------------------------------------------------- */
/*                                댓글 API                                   */
/* -------------------------------------------------------------------------- */

export const getComments = async (postId: number) => {
  try {
    const res = await api.get(`/api/community/posts/${postId}/comments`);
    return res.data?.result?.comments ?? [];
  } catch (err) {
    console.error('댓글 목록 조회 실패:', err);
    return [];
  }
};

export const createComment = async (postId: number, content: string) => {
  try {
    const res = await api.post(`/api/community/posts/${postId}/comments`, {
      content,
    });
    return res.data?.result;
  } catch (err) {
    console.error('댓글 생성 실패:', err);
    throw err;
  }
};

export const updateComment = async (commentId: number, content: string) => {
  try {
    const res = await api.put(`/api/community/posts/comments/${commentId}`, {
      content,
    });
    return res.data?.result;
  } catch (err) {
    console.error('댓글 수정 실패:', err);
    throw err;
  }
};

export const deleteComment = async (commentId: number) => {
  try {
    const res = await api.delete(`/api/community/posts/comments/${commentId}`);
    return res.data?.result;
  } catch (err) {
    console.error('댓글 삭제 실패:', err);
    throw err;
  }
};

/* -------------------------------------------------------------------------- */
/*                          사용자 프로필 / 팔로우 API                        */
/* -------------------------------------------------------------------------- */

/* ------------------------------ 타입 정의 ------------------------------ */
export interface UserProfile {
  memberId: number;
  nickname: string;
  profileImg: string;
  postCount: number;
  albumCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

/* ------------------------------ 사용자 프로필 조회 ------------------------------ */
/* GET /api/community/users/{userId}/info */
export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  try {
    const res = await api.get(`/api/community/users/${userId}/info`);
    const data = res.data?.result;

    // 데이터 안전 처리
    return (
      data ?? {
        memberId: userId,
        nickname: '알 수 없음',
        profileImg: '/images/profile.png',
        postCount: 0,
        albumCount: 0,
        followerCount: 0,
        followingCount: 0,
        isFollowing: false,
      }
    );
  } catch (err) {
    console.error('사용자 프로필 조회 실패:', err);

    return {
      memberId: userId,
      nickname: '알 수 없음',
      profileImg: '/images/profile.png',
      postCount: 0,
      albumCount: 0,
      followerCount: 0,
      followingCount: 0,
      isFollowing: false,
    };
  }
};

/* ------------------------------ 팔로우 / 언팔로우 토글 ------------------------------ */
/* POST /api/community/follow/{userId} */
export const toggleFollowUser = async (userId: number) => {
  try {
    const res = await api.post(`/api/community/follow/${userId}`);
    return res.data;
  } catch (err) {
    console.error('팔로우/언팔로우 실패:', err);
    throw err;
  }
};

/* ----------------------------- 내 팔로워 목록 조회 ------------------------------ */
/* GET /api/community/followers/me */
export const getFollowers = async () => {
  try {
    const res = await api.get(`/api/community/followers/me`);
    return res.data?.result ?? [];
  } catch (err) {
    console.error('팔로워 조회 실패:', err);
    return [];
  }
};

/* ------------------------------  내 팔로잉 목록 조회 ------------------------------ */
/* GET /api/community/followings/me */
export const getFollowings = async () => {
  try {
    const res = await api.get(`/api/community/followings/me`);
    return res.data?.result ?? [];
  } catch (err) {
    console.error('팔로잉 조회 실패:', err);
    return [];
  }
};

/* -------------------------------------------------------------------------- */
/*                                내 활동 조회                                */
/* -------------------------------------------------------------------------- */

export const getMyPosts = async () => {
  try {
    const res = await api.get(`/api/community/users/me/posts`);
    return res.data;
  } catch (err) {
    console.error('내 게시글 조회 실패:', err);
    throw err;
  }
};

export const getMyComments = async () => {
  try {
    const res = await api.get(`/api/community/users/me/comments`);
    return res.data;
  } catch (err) {
    console.error('내 댓글 조회 실패:', err);
    throw err;
  }
};

export const getMyScraps = async () => {
  try {
    const res = await api.get(`/api/community/users/me/scraps`);
    return res.data;
  } catch (err) {
    console.error('내 스크랩 조회 실패:', err);
    throw err;
  }
};

/* -------------------------------------------------------------------------- */
/*                     특정 사용자 게시글 목록 조회 API                   */
/* -------------------------------------------------------------------------- */

export const getUserPosts = async (userId: number) => {
  try {
    const res = await api.get(`/api/community/users/${userId}/posts`);
    return res.data?.result?.posts ?? [];
  } catch (err) {
    console.error('특정 유저 게시글 조회 실패:', err);
    return [];
  }
};

/* ----------------------------- 제목/내용 검색 ----------------------------- */
export const searchPostsByKeyword = async (keyword: string) => {
  const res = await api.get(`/api/community/posts/search`, {
    params: { keyword },
  });
  return res.data.result.posts;
};

/* ----------------------------- 태그 검색 (단일/다중) ----------------------------- */
export const searchPostsByTags = async (tags: string[]) => {
  const res = await api.get(`/api/community/posts/search`, {
    params: { tags }, // 배열 그대로
  });
  return res.data.result.posts;
};

/* ----------------------------- 단일 태그 검색 ----------------------------- */
export const searchPostsBySingleTag = async (tag: string) => {
  const res = await api.get(`/api/community/posts/tag/${tag}`);
  return res.data.result.posts || [];
};
