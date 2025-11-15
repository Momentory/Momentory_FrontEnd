import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Menu from "../../assets/icons/menuIcon.svg?react";
import Bell from "../../assets/icons/bellIcon.svg?react";
import ActiveBell from "../../assets/icons/bellActiveIcon.svg?react";
import Profile from "../../assets/icons/defaultProfile.svg?react";
import Dropdown from "../../assets/icons/dropdown.svg?react";
import Sidebar from "./SideBar";
import { useWebSocket } from "../../hooks/notification/useWebSocket";
import { getUnreadStatus } from "../../api/notification";
import { getMyProfileSummary } from "../../api/mypage";
import { getUserIdFromToken } from "../../utils/jwt";
import { tokenStore } from "../../lib/token";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState("Username");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // JWT 토큰에서 userId 추출
  const accessToken = tokenStore.getAccess();
  const userId = getUserIdFromToken(accessToken);

  // WebSocket 연결 (로그인된 경우에만)
  useWebSocket({
    userId,
    autoConnect: !!userId,
    onNotification: (notification) => {
      setHasNotification(true);
      // 서버에서 보낸 정확한 unreadCount 사용
      setUnreadCount(notification.unreadCount);
    },
  });

  // 프로필 정보 조회
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const profile = await getMyProfileSummary();
        setUserName(profile.nickname);
        setProfileImageUrl(profile.imageUrl);
      } catch (error) {
        console.error("프로필 정보 조회 실패:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  // 초기 미확인 알림 상태 조회
  useEffect(() => {
    if (!userId) return;

    const fetchUnreadStatus = async () => {
      try {
        const response = await getUnreadStatus();
        setHasNotification(response.result.hasUnread);
        setUnreadCount(response.result.unreadCount);
      } catch (error) {
        console.error("미확인 알림 조회 실패:", error);
      }
    };

    fetchUnreadStatus();
  }, [userId]);

  // 알림 목록 페이지로 이동하면 unread 상태 업데이트
  useEffect(() => {
    if (location.pathname === "/notifications") {
      // 알림 페이지를 방문하면 알림 상태 새로고침
      const fetchUnreadStatus = async () => {
        try {
          const response = await getUnreadStatus();
          setHasNotification(response.result.hasUnread);
          setUnreadCount(response.result.unreadCount);
        } catch (error) {
          console.error("미확인 알림 조회 실패:", error);
        }
      };

      // 페이지 이동 후 잠시 대기 후 상태 새로고침
      const timer = setTimeout(fetchUnreadStatus, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 현재 페이지가 settings인지 확인
  const isSettingsPage = location.pathname === '/settings';

  return (
    <>
      {/* 공통 헤더 */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex justify-between items-center px-4 py-3 bg-[#FF7070] shadow-[0px_4px_4px_rgba(0,0,0,0.15)] border-b-[1px] border-white z-50">
        {/*환경설정 페이지일 경우 */}
        {isSettingsPage ? (
          <div className="relative flex items-center justify-center w-full">
            {/* 뒤로가기 버튼 */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2"
            >
              <ArrowLeft size={22} className="text-white" />
            </button>

            {/* 타이틀 */}
            <h1 className="text-[17px] font-semibold text-white">환경설정</h1>
          </div>
        ) : (
          <>
            {/* 기본 헤더 내용 */}
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-7 h-7 text-white cursor-pointer" />
              </button>
              <button
                onClick={() => navigate("/notifications")}
                className="relative"
              >
                {hasNotification ? (
                  <>
                    <ActiveBell className="w-7 h-7 text-white cursor-pointer" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-[#FF7070] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </>
                ) : (
                  <Bell className="w-7 h-7 text-white cursor-pointer" />
                )}
              </button>
            </div>

            {/* Username + 드롭다운 */}
            <div ref={dropdownRef} className="relative flex items-center gap-2.5">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="프로필"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <Profile className="w-8 h-8" />
              )}
              <p className="text-white font-medium">{userName}</p>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="focus:outline-none"
              >
                <Dropdown
                  className={`w-3 text-white cursor-pointer transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-[52px] w-[150px] bg-white text-gray-700 rounded-xl shadow-lg overflow-hidden border z-50 animate-[fadeIn_0.2s_ease-out]">
                  <button
                    onClick={() => {
                      navigate("/settings/profile-edit");
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-[14px] hover:bg-gray-50"
                  >
                    프로필 수정
                  </button>
                  <button
                    onClick={() => {
                      alert('로그아웃');
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-[14px] hover:bg-gray-50"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </header>

      {/* 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Header;
