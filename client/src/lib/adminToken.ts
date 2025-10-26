const STORAGE_KEY = "admin-token";

export function getStoredAdminToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEY);
}

export function setStoredAdminToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, token);
}

export function clearStoredAdminToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export const ADMIN_TOKEN_STORAGE_KEY = STORAGE_KEY;
