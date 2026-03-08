// src/types/admin.ts

export interface AdminLoginPayload {
  adminId: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeAdminIdPayload {
  password: string;
  newAdminId: string;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface AdminState {
  token: string | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}
