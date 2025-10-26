import { useCallback, useState } from "react";
import {
  clearStoredAdminToken,
  getStoredAdminToken,
  setStoredAdminToken,
} from "@/lib/adminToken";

/**
 * Small client-side helper for working with the admin token. The token is
 * persisted in {@link localStorage} so the admin panel can survive refreshes.
 */
export function useAdminToken() {
  const [token, setToken] = useState(() => getStoredAdminToken());

  const saveToken = useCallback((value: string) => {
    setStoredAdminToken(value);
    setToken(value);
  }, []);

  const clearToken = useCallback(() => {
    clearStoredAdminToken();
    setToken(null);
  }, []);

  return {
    token,
    isAuthenticated: Boolean(token),
    saveToken,
    clearToken,
  } as const;
}
