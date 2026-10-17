import { authApi } from "./client";

export const refreshUser = () =>
    authApi<{ message: string; token: string }>('auth/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('refreshtoken')}` }
    })