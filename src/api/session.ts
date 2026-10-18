import { logoutUser } from "./logout";


export function clearSession() {
  const refreshToken = localStorage.getItem("refreshtoken");
  if (refreshToken) {
    logoutUser(refreshToken).catch(() => {});
  }
  localStorage.removeItem("token");
  localStorage.removeItem("refreshtoken");
}
