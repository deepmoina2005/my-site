import axiosInstance from "@/utils/axiosInstance";
import type { ProductResponse } from "@/types/product";

/* ===============================
   CREATE PRODUCT
================================ */
export const createProductService = async (
  data: FormData
): Promise<ProductResponse> => {
  const res = await axiosInstance.post("/products/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* ===============================
   GET ALL PRODUCTS
================================ */
export const getProductsService = async (): Promise<ProductResponse> => {
  const res = await axiosInstance.get("/products");
  return res.data;
};

/* ===============================
   GET PRODUCT BY ID
================================ */
export const getProductByIdService = async (
  id: string
): Promise<ProductResponse> => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data;
};

/* ===============================
   DELETE PRODUCT
================================ */
export const deleteProductService = async (
  id: string
): Promise<ProductResponse> => {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data;
};
