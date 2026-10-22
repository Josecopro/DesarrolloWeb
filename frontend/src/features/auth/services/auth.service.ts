import { http } from "@/features/common/http";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../domain/types";

export const authService = {
  login: (data: LoginRequest) => http.post<AuthResponse>("/auth/login", data),
  register: (data: RegisterRequest) => http.post<AuthResponse>("/auth/register", data),
  me: () => http.get<{ user: User }>("/auth/me").then((r) => r.user),
};
