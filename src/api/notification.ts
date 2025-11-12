import { api } from './client';

/* ----------------------------- 타입 정의 ----------------------------- */

export type NotificationType =
  | 'COMMENT'
  | 'LIKE'
  | 'FOLLOW'
  | 'LEVEL_UP'
  | 'REWARD'
  | 'ROULETTE'
  | 'ANNOUNCEMENT';

export interface Notification {
  notificationId: number;
  type: NotificationType;
  message: string;
  relatedId: number | null;
  relatedUrl: string | null;
  read: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    notifications: Notification[];
    totalCount: number;
    unreadCount: number;
  };
}

export interface UnreadStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    hasUnread: boolean;
    unreadCount: number;
  };
}

export interface NotificationSettings {
  allNotifications: boolean;
  communityAlert: boolean;
  followAlert: boolean;
  levelUpAlert: boolean;
}

export interface NotificationSettingsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: NotificationSettings;
}

export interface ApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

/* ----------------------------- 알림 조회 ----------------------------- */

// 내 알림 조회
export const getNotifications = async (): Promise<NotificationListResponse> => {
  const { data } = await api.get('/api/notifications');
  return data;
};

// 미확인 알림 여부 조회
export const getUnreadStatus = async (): Promise<UnreadStatusResponse> => {
  const { data } = await api.get('/api/notifications/unread');
  return data;
};

/* ----------------------------- 알림 읽음 처리 ----------------------------- */

// 전체 알림 읽음 처리
export const markAllAsRead = async (): Promise<ApiResponse> => {
  const { data } = await api.put('/api/notifications/read-all');
  return data;
};

// 특정 알림 읽음 처리
export const markAsRead = async (notificationId: number): Promise<ApiResponse> => {
  const { data } = await api.put(`/api/notifications/${notificationId}/read`);
  return data;
};

// 여러 알림 읽음 처리
export const markMultipleAsRead = async (
  notificationIds: number[]
): Promise<ApiResponse> => {
  const { data } = await api.put('/api/notifications/read', {
    notificationIds,
  });
  return data;
};

/* ----------------------------- 알림 설정 ----------------------------- */

// 알림 설정 조회
export const getNotificationSettings = async (): Promise<NotificationSettingsResponse> => {
  const { data } = await api.get('/api/notifications/settings');
  return data;
};

// 알림 설정 변경
export const updateNotificationSettings = async (
  settings: NotificationSettings
): Promise<NotificationSettingsResponse> => {
  const { data } = await api.put('/api/notifications/settings/me', settings, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data;
};
