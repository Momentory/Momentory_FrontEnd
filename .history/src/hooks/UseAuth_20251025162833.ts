import { useEffect, useState } from "react";
import { tokenStore } from "../lib/token";
import { logout } from "../api/auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const access = tokenStore.getAccess();
    setIsAuthenticated(!!access);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    window.location.href = "/login"; // 로그아웃 후 이동
  };

  return { isAuthenticated, handleLogout };
}
