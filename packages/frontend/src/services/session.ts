export const sessionTokenKey = 'cert10:token';

export function getAuthToken() {
  return sessionStorage.getItem(sessionTokenKey);
}

export function setAuthToken(token: string | null) {
  if (!token) {
    return sessionStorage.removeItem(sessionTokenKey);
  }
  return sessionStorage.setItem(sessionTokenKey, token);
}
