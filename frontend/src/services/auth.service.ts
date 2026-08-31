import { apiClient, setAuthToken, getAuthToken } from "@/lib/api/client";
import { LoginRequest, LoginResponse, UserResponse } from "@/types/api";

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.admin.auth.login(credentials);
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    return apiClient.admin.auth.me();
  },

  logout: (): void => {
    setAuthToken(null);
  },

  isAuthenticated: (): boolean => {
    return Boolean(getAuthToken());
  },
};
