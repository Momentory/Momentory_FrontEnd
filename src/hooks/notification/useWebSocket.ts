import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { tokenStore } from '../../lib/token';

interface WebSocketNotification {
  type: string;
  message: string;
  relatedId: number | null;
  timestamp: string;
  unreadCount: number; // 현재 미확인 알림 총 개수
}

interface UseWebSocketOptions {
  userId: number | null;
  onNotification?: (notification: WebSocketNotification) => void;
  autoConnect?: boolean;
}

export const useWebSocket = ({
  userId,
  onNotification,
  autoConnect = true,
}: UseWebSocketOptions) => {
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<any>(null); // subscription 타입은 any로 설정
  const onNotificationRef = useRef(onNotification); // onNotification을 ref로 관리
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<WebSocketNotification[]>([]);
  const [error, setError] = useState<string | null>(null);

  // onNotification이 변경되면 ref 업데이트
  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    if (!userId || !autoConnect) {
      return;
    }

    const accessToken = tokenStore.getAccess();
    if (!accessToken) {
      console.error('WebSocket: 토큰이 없습니다.');
      setError('인증 토큰이 없습니다.');
      return;
    }

    // WebSocket URL 설정
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const wsUrl = `${baseUrl}/ws`;


    const socket = new SockJS(wsUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        setIsConnected(true);
        setError(null);

        // 개인 알림 구독
        const subscription = client.subscribe(
          `/topic/notifications/${userId}`,
          (message) => {
            try {
              const notification: WebSocketNotification = JSON.parse(message.body);

              // 알림 목록에 추가
              setNotifications((prev) => [notification, ...prev]);

              // 콜백 실행 (ref 사용)
              onNotificationRef.current?.(notification);

              // 브라우저 알림 (Notification API가 지원되는 경우에만)
              if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                new Notification('새 알림', {
                  body: notification.message,
                  icon: '/logo.png',
                });
              }
            } catch (err) {
              console.error('❌ 알림 파싱 에러:', err);
            }
          }
        );

        subscriptionRef.current = subscription;
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('❌ WebSocket 에러:', frame);
        setError('WebSocket 연결 에러가 발생했습니다.');
        setIsConnected(false);
      },
      // 자동 재연결 설정
      reconnectDelay: 5000, // 5초 후 재연결 시도
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.activate();
    stompClientRef.current = client;

    // 브라우저 알림 권한 요청 (Notification API가 지원되는 경우에만)
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [userId, autoConnect]); // onNotification 제거 - ref로 관리

  // 수동 연결
  const connect = () => {
    if (stompClientRef.current && !stompClientRef.current.connected) {
      stompClientRef.current.activate();
    }
  };

  // 수동 연결 해제
  const disconnect = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
  };

  // 알림 목록 초기화
  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    isConnected,
    notifications,
    error,
    connect,
    disconnect,
    clearNotifications,
  };
};
