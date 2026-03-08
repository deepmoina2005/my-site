import os
from pathlib import Path

ADMIN_DIR = Path("v:/My Website/admin/src")

missing_entities = ["category", "certificate", "education", "service"]

# Slice Template (adapted' for Admin)
slice_template = """/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api/PLURAL_NAME";

export const fetchENTITY_NAMEs = createAsyncThunk("PLURAL_NAME/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch");
  }
});

export const addENTITY_NAME = createAsyncThunk("PLURAL_NAME/add", async (data: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add");
  }
});

export const updateENTITY_NAME = createAsyncThunk("PLURAL_NAME/update", async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update");
  }
});

export const deleteENTITY_NAME = createAsyncThunk("PLURAL_NAME/delete", async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete");
  }
});

const initialState = {
  PLURAL_NAME: [],
  loading: false,
  error: null as string | null,
};

const slice = createSlice({
  name: "PLURAL_NAME",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchENTITY_NAMEs.pending, (state) => { state.loading = true; })
      .addCase(fetchENTITY_NAMEs.fulfilled, (state, action) => {
        state.loading = false;
        state.PLURAL_NAME = action.payload.PLURAL_NAME || action.payload;
      })
      .addCase(fetchENTITY_NAMEs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteENTITY_NAME.fulfilled, (state, action) => {
        state.PLURAL_NAME = state.PLURAL_NAME.filter((item: any) => item._id !== action.payload);
      });
  },
});

export default slice.reducer;
"""

entity_plurals = {
    "category": "categories",
    "certificate": "certificates",
    "education": "educations",
    "service": "services"
}

for entity in missing_entities:
    plural = entity_plurals[entity]
    content = slice_template.replace("ENTITY_NAME", entity.capitalize()).replace("PLURAL_NAME", plural)
    with open(ADMIN_DIR / "features" / entity / f"{entity}Slice.ts", "w", encoding="utf-8") as f:
        f.write(content)

# CRUD Pages (Minimalistic list for now to ensure functionality)
list_page_template = """
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchENTITY_NAMEs, deleteENTITY_NAME } from "../ENTITY_NAMESlice";
import { RootState, AppDispatch } from "@/redux/store";
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AllENTITY_NAMEs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { PLURAL_NAME, loading } = useSelector((state: RootState) => state.PLURAL_NAME);

  useEffect(() => {
    dispatch(fetchENTITY_NAMEs());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      dispatch(deleteENTITY_NAME(id)).then(() => toast.success("Deleted"));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All ENTITY_NAMEs</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title/Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PLURAL_NAME.map((item: any) => (
            <TableRow key={item._id}>
              <TableCell>{item.title || item.name || item.institution || item.degree}</TableCell>
              <TableCell>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(item._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllENTITY_NAMEs;
"""

for entity in missing_entities:
    plural = entity_plurals[entity]
    name_cap = entity.capitalize()
    content = list_page_template.replace("ENTITY_NAME", name_cap).replace("PLURAL_NAME", plural)
    # Ensure pages directory exists
    (ADMIN_DIR / "features" / entity / "pages").mkdir(parents=True, exist_ok=True)
    with open(ADMIN_DIR / "features" / entity / "pages" / f"All{name_cap}s.tsx", "w", encoding="utf-8") as f:
        f.write(content)

print("Generated Admin Redux slices and List pages.")
