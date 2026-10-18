import { authApi } from "./client";


export const logoutUser = (refreshToken: string) =>
    authApi<{ message: string }>('/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` },
        keepalive: true,
    })
