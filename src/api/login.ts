import { authApi } from "./client";

export const loginUser = (userData: {
  username: string;
  password: string;
}): Promise<{ message: string; token: string; refresh: string }> =>
  authApi<{ message: string; token: string; refresh:string }>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
