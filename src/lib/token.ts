const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export const tokenStore = {
  getAccess() {
    return localStorage.getItem(ACCESS_KEY) || "";
  },
  getRefresh() {
    return localStorage.getItem(REFRESH_KEY) || "";
  },
  set(tokens: Tokens) {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
