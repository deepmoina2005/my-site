// src/redux/services/adminService.ts
import axiosInstance from "@/utils/axiosInstance";
import type {
    AdminLoginPayload,
    ChangePasswordPayload,
    ChangeAdminIdPayload,
    AdminResponse
} from "../../types/admin";

export const adminLoginService = async (
  data: AdminLoginPayload
): Promise<AdminResponse> => {
  const res = await axiosInstance.post("/admin/login", data);
  return res.data;
};

export const adminLogoutService = async (): Promise<AdminResponse> => {
  const res = await axiosInstance.post("/admin/logout");
  return res.data;
};

export const changePasswordService = async (
  data: ChangePasswordPayload
): Promise<AdminResponse> => {
  const res = await axiosInstance.put("/admin/change-password", data);
  return res.data;
};

export const changeAdminIdService = async (
  data: ChangeAdminIdPayload
): Promise<AdminResponse> => {
  const res = await axiosInstance.put("/admin/change-admin-id", data);
  return res.data;
};
