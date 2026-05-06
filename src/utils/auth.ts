const KEYS = {
  accessToken: "access_token",
  expiredAt: "expired_at",
  role: "role",
  tokenType: "token_type",
} as const;

export interface ProfileAccess {
  id: number;
  menu: string;
  path: string;
  is_create: boolean;
  is_read: boolean;
  is_update: boolean;
  is_delete: boolean;
  is_maintenece: boolean;
}

export interface UserProfile {
  user: {
    id: number;
    name: string;
    username: string;
    supervisor_id: number | null;
    supervisor_name: string | null;
  };
  role: {
    id: number;
    name: string;
    access: ProfileAccess[];
  };
}

export interface AuthSession {
  access_token: string;
  expired_at: string;
  role: string;
  token_type: string;
}

export const setAuthSession = (session: AuthSession) => {
  localStorage.setItem(KEYS.accessToken, session.access_token);
  localStorage.setItem(KEYS.expiredAt, session.expired_at);
  localStorage.setItem(KEYS.role, session.role);
  localStorage.setItem(KEYS.tokenType, session.token_type);
};

export const getAuthSession = (): AuthSession | null => {
  const access_token = localStorage.getItem(KEYS.accessToken);
  if (!access_token) return null;

  return {
    access_token,
    expired_at: localStorage.getItem(KEYS.expiredAt) || "",
    role: localStorage.getItem(KEYS.role) || "",
    token_type: localStorage.getItem(KEYS.tokenType) || "",
  };
};

export const getAccessToken = (): string | null =>
  localStorage.getItem(KEYS.accessToken);

export const clearAuthSession = () => {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
};

export const isSessionValid = (): boolean => {
  const session = getAuthSession();
  if (!session) return false;
  return new Date(session.expired_at) > new Date();
};
