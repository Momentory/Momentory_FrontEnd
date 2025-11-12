import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DropdownHeader from "../../components/common/DropdownHeader";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  type Notification,
} from "../../api/notification";

export default function NotificationListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [_totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 알림 목록 조회 - 페이지 진입할 때마다 새로 조회
  useEffect(() => {
    if (location.pathname === "/notifications") {
      fetchNotifications();
    }
  }, [location.pathname]);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.result.notifications);
      setUnreadCount(response.result.unreadCount);
      setTotalCount(response.result.totalCount);
    } catch (error) {
      console.error("알림 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 알림 타입에 따라 페이지 경로 반환
  const getNavigationPath = (notification: Notification): string | null => {
    const { type, relatedId } = notification;

    switch (type) {
      case "COMMENT":
      case "LIKE":
        // 댓글, 좋아요 알림 → 게시글 상세 페이지
        return relatedId ? `/community/detail/${relatedId}` : null;

      case "FOLLOW":
        // 팔로우 알림 → 유저 프로필 페이지
        return relatedId ? `/community/user/${relatedId}` : null;

      case "LEVEL_UP":
      case "REWARD":
        // 레벨업, 보상 알림 → 캐릭터 페이지
        return "/character";

      case "ROULETTE":
        // 룰렛 알림 → 룰렛 페이지
        return "/roulette";

      case "ANNOUNCEMENT":
        // 공지사항 알림 → 홈 페이지 (또는 공지사항 페이지가 있다면 그곳으로)
        return "/home";

      default:
        return null;
    }
  };

  // 알림 클릭 처리 (읽음 처리 + 페이지 이동)
  const handleNotificationClick = async (notification: Notification) => {
    // 읽지 않은 알림이면 즉시 UI 업데이트 (낙관적 업데이트)
    if (!notification.read) {
      // 먼저 UI를 업데이트 (사용자가 즉시 배경색 변화를 볼 수 있도록)
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notification.notificationId
            ? { ...n, read: true }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // 백그라운드에서 API 호출
      markAsRead(notification.notificationId).catch((error) => {
        console.error("알림 읽음 처리 실패:", error);
        // 실패 시 롤백
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === notification.notificationId
              ? { ...n, read: false }
              : n
          )
        );
        setUnreadCount((prev) => prev + 1);
      });
    }

    // 페이지 이동 (약간의 지연을 주어 UI 업데이트가 보이도록)
    const path = getNavigationPath(notification);
    if (path) {
      setTimeout(() => navigate(path), 100);
    }
  };

  // 전체 알림 읽음 처리
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("전체 읽음 처리 실패:", error);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "COMMENT":
        return "💬";
      case "LIKE":
        return "❤️";
      case "FOLLOW":
        return "👤";
      case "LEVEL_UP":
        return "🎉";
      case "REWARD":
        return "🎁";
      case "ROULETTE":
        return "🎰";
      case "ANNOUNCEMENT":
        return "📢";
      default:
        return "🔔";
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen">
      <DropdownHeader
        title="알림"
        hasDropdown={false}
        rightAction={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllAsRead}
              className="text-[14px] text-[#FF7070] font-medium"
            >
              모두 읽음
            </button>
          ) : undefined
        }
      />

      {/* 알림 목록 */}
      <div className="pb-20 mt-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">알림을 불러오는 중...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-500 text-[16px]">알림이 없습니다</p>
          </div>
        ) : (
          <>
            {/* 읽지 않은 알림 */}
            {notifications.filter((n) => !n.read).length > 0 && (
              <div className="mb-4">
                <div className="px-5 py-3 bg-gray-50">
                  <h2 className="text-[14px] font-semibold text-gray-700">
                    읽지 않은 알림 ({unreadCount})
                  </h2>
                </div>
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div
                      key={notification.notificationId}
                      className="px-5 py-4 border-b border-gray-200 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start">
                        <div className="text-2xl mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-[15px] text-gray-800 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-[12px] text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <div className="w-2 h-2 bg-[#FF7070] rounded-full mt-2 ml-2"></div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 읽은 알림 */}
            {notifications.filter((n) => n.read).length > 0 && (
              <div>
                <div className="px-5 py-3 bg-gray-50">
                  <h2 className="text-[14px] font-semibold text-gray-700">
                    이전 알림
                  </h2>
                </div>
                {notifications
                  .filter((n) => n.read)
                  .map((notification) => (
                    <div
                      key={notification.notificationId}
                      className="px-5 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start">
                        <div className="text-2xl mr-3 opacity-50">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-[15px] text-gray-600 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-[12px] text-gray-400">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
