import { useEffect, useState } from 'react';
import { tokenStore } from '../lib/token';
import { api } from '../api/client';
import { logout } from '../api/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 최초 진입 시 로그인 상태 검증
  useEffect(() => {
    const checkAuth = async () => {
      const access = tokenStore.getAccess();
      const refresh = tokenStore.getRefresh();

      // 토큰이 전혀 없는 경우 → 비로그인 상태
      if (!access && !refresh) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Access 토큰으로 간단한 인증 확인 API 호출
        await api.get('/api/auth/check-email', {
          params: { email: 'ping@check' },
        });
        setIsAuthenticated(true);
      } catch (err: any) {
        // AccessToken이 만료된 경우 자동 재발급 시도
        if (refresh) {
          try {
            const { data } = await api.post('/api/auth/reissue', {
              refreshToken: refresh,
            });
            tokenStore.set({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken ?? refresh,
            });
            setIsAuthenticated(true);
          } catch {
            tokenStore.clear();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      tokenStore.clear();
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  return { isAuthenticated, loading, handleLogout };
}
