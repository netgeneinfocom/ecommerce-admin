// Auth-specific TypeScript types and interfaces

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface Permission {
  _id: string;
  can_add_superadmin: boolean;
  can_add_admin: boolean;
  can_add_records: boolean;
  can_update_records: boolean;
  can_read_records: boolean;
  can_delete_records: boolean;
}

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  permission: Permission[];
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export type AuthProvider = "email" | "google" | "github" | "facebook";

export type UserRole = 'admin' | 'superadmin' | 'user';

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: AuthError | null;
}
