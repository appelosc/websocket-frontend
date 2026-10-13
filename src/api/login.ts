import { authApi } from "./client";

export const loginUser = (userData: {
  username: string;
  password: string;
}): Promise<{ message: string; token: string }> =>
  authApi<{ message: string; token: string }>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
