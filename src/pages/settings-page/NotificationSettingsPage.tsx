import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotificationSettings,
  updateNotificationSettings,
  type NotificationSettings,
} from "../../api/notification";

export default function NotificationSettingsPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [settings, setSettings] = useState<NotificationSettings>({
    allNotifications: true,
    communityAlert: true,
    followAlert: true,
    levelUpAlert: true,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 초기 설정 불러오기
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getNotificationSettings();
        setSettings(response.result);
      } catch (error) {
        console.error("알림 설정 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 설정 변경 핸들러
  const handleToggle = async (key: keyof NotificationSettings) => {
    // allNotifications를 끄면 모든 알림이 꺼지고, 켜면 모든 알림이 켜짐
    const newSettings =
      key === "allNotifications"
        ? {
            allNotifications: !settings.allNotifications,
            communityAlert: !settings.allNotifications,
            followAlert: !settings.allNotifications,
            levelUpAlert: !settings.allNotifications,
          }
        : { ...settings, [key]: !settings[key] };

    // 낙관적 업데이트
    setSettings(newSettings);
    setUpdating(true);

    try {
      const response = await updateNotificationSettings(newSettings);
      setSettings(response.result);
    } catch (error) {
      console.error("알림 설정 변경 실패:", error);
      // 에러 발생 시 원래 상태로 복구
      setSettings(settings);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen">
      {/* 상단바 */}
      <div className="relative flex items-center justify-center px-5 py-4 bg-white mb-[70px]">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute left-[20px] top-[50%] -translate-y-1/2 w-[28px] h-[28px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[25px] font-semibold text-gray-800">알림</h1>
      </div>

      {/* 알림 설정 안내 */}
      <div className="px-6 mt-6">
        <h2 className="text-[20px] font-semibold text-black-800 mb-1">알림 설정</h2>
        <p className="text-[13px] text-gray-500 mb-5">
          알림을 받을 방법을 선택하세요.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="text-gray-500">설정을 불러오는 중...</div>
          </div>
        ) : (
          <>
            {/* 모든 알림 받기 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-[20px] font-semibold text-black-800">
                  모든 알림 받기
                </p>
                <p className="text-[13px] text-gray-500">
                  모든 알림을 한번에 켜거나 끕니다.
                </p>
              </div>
              {/* 스위치 */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allNotifications}
                  onChange={() => handleToggle("allNotifications")}
                  disabled={updating}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF7070] transition-colors duration-200 peer-disabled:opacity-50"></div>
                <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[22px]"></div>
              </label>
            </div>

            {/* 커뮤니티 알림 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-[20px] font-semibold text-black-800">
                  커뮤니티 알림
                </p>
                <p className="text-[13px] text-gray-500">
                  댓글, 좋아요 등 커뮤니티 활동 알림을 받습니다.
                </p>
              </div>
              {/* 스위치 */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.communityAlert}
                  onChange={() => handleToggle("communityAlert")}
                  disabled={updating || !settings.allNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF7070] transition-colors duration-200 peer-disabled:opacity-50"></div>
                <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[22px]"></div>
              </label>
            </div>

            {/* 팔로우 알림 */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-[20px] font-semibold text-black-800">
                  팔로우 알림
                </p>
                <p className="text-[13px] text-gray-500">
                  새로운 팔로워 알림을 받습니다.
                </p>
              </div>
              {/* 스위치 */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.followAlert}
                  onChange={() => handleToggle("followAlert")}
                  disabled={updating || !settings.allNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF7070] transition-colors duration-200 peer-disabled:opacity-50"></div>
                <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[22px]"></div>
              </label>
            </div>

            {/* 레벨업 및 보상 알림 */}
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-[20px] font-semibold text-black-800">
                  레벨업 및 보상 알림
                </p>
                <p className="text-[13px] text-gray-500">
                  레벨업, 보상, 룰렛 등의 알림을 받습니다.
                </p>
              </div>
              {/* 스위치 */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.levelUpAlert}
                  onChange={() => handleToggle("levelUpAlert")}
                  disabled={updating || !settings.allNotifications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#FF7070] transition-colors duration-200 peer-disabled:opacity-50"></div>
                <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[22px]"></div>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
