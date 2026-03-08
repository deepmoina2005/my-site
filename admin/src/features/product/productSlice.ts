/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  deleteProductService,
} from "@/features/product/productAPI";
import type { ProductState, Product } from "@/types/product";

/* ===============================
   ASYNC THUNKS
================================ */

// CREATE PRODUCT
export const createProduct = createAsyncThunk<
  { product: Product },
  FormData,
  { rejectValue: string | undefined }
>("products/create", async (data, { rejectWithValue }) => {
  try {
    const response = await createProductService(data);
    if (!response.product) throw new Error("Product data missing");
    return { product: response.product };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error creating product"
    );
  }
});

// GET ALL PRODUCTS
export const getProducts = createAsyncThunk<
  { products: Product[] },
  void,
  { rejectValue: string | undefined }
>("products/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getProductsService();
    return { products: response.products || [] };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching products"
    );
  }
});

// GET PRODUCT BY ID
export const getProductById = createAsyncThunk<
  { product: Product },
  string,
  { rejectValue: string | undefined }
>("products/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await getProductByIdService(id);
    if (!response.product) throw new Error("Product data missing");
    return { product: response.product };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error fetching product"
    );
  }
});

// DELETE PRODUCT
export const deleteProduct = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string | undefined }
>("products/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteProductService(id);
    return { id };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Error deleting product"
    );
  }
});

/* ===============================
   INITIAL STATE
================================ */
const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  success: false,
  error: null,
};

/* ===============================
   SLICE
================================ */
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductState: (state) => {
      state.product = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE PRODUCT */
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products.unshift(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error creating product";
      })

      /* GET ALL PRODUCTS */
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching products";
      })

      /* GET PRODUCT BY ID */
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.product = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching product";
      })

      /* DELETE PRODUCT */
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter(
          (p) => p._id !== action.payload.id
        );
        if (state.product?._id === action.payload.id) {
          state.product = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error deleting product";
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
