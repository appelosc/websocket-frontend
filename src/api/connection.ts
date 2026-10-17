import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_WEBSOCKET_API_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
});