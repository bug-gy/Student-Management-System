import client, { setAccessToken } from "./client";
import type { ApiResponse, User } from "../types";

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await client.post<ApiResponse<{ user: User; accessToken: string }>>(
      "/auth/login",
      { email, password },
    );
    setAccessToken(data.data.accessToken);
    return data.data;
  },

  logout: async () => {
    await client.post("/auth/logout");
    setAccessToken(null);
  },

  refresh: async () => {
    const { data } = await client.post<ApiResponse<{ accessToken: string }>>("/auth/refresh");
    setAccessToken(data.data.accessToken);
    return data.data;
  },

  getMe: async () => {
    const { data } = await client.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },
};
