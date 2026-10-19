import { io } from "socket.io-client";
import { refreshUser } from "./refresh";
import { clearSession } from "./session";

export const socket = io(import.meta.env.VITE_WEBSOCKET_API_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
});



socket.on("connect_error", async (err) => {
  if (err.message === "No token provided" || err.message === "Invalid token") {
    logout();
    return;
  }
  if (err.message != "TokenExpiredError") return;
  try {
    await refreshToken()
    socket.connect()
  } catch {
    // errors handled
  }

});


let refreshPromise: Promise<string> | null = null;

function refreshToken(): Promise<string> {
  if (refreshPromise) return refreshPromise; 
  refreshPromise = (async () => {
    try {
      const { token } = await refreshUser();
      localStorage.setItem("token", token);
      return token;
    } catch (err) {
      logout();
      throw err; 
    } finally {
      refreshPromise = null; 
    }
  })(); 

  return refreshPromise;
}


export function logout() {
  socket.disconnect();
  clearSession();
  window.location.hash = "/login";
}

socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") socket.connect();
});






