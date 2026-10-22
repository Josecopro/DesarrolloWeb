export type Role = "admin" | "user";

/** Usuario público tal como lo devuelve la API (nunca incluye la contraseña). */
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export type SessionUser = User;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
