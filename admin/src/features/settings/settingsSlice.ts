/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api/settings";

/* ─── Thunks ─────────────────────────────────────────────── */

export const fetchSettings = createAsyncThunk(
  "settings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL);
      return res.data.settings;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load settings");
    }
  }
);

export const saveSettings = createAsyncThunk(
  "settings/save",
  async (data: Partial<SettingsState["settings"]>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(BASE_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.settings;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to save settings");
    }
  }
);

export const uploadSettingFile = createAsyncThunk(
  "settings/uploadFile",
  async ({ file, field }: { file: File; field: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.put(`${BASE_URL}/upload?field=${field}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data; // { url, field }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

/* ─── State ─────────────────────────────────────────────── */
interface SettingsState {
  settings: {
    general: { siteName: string; siteTagline: string; siteDescription: string; siteLogoUrl: string; faviconUrl: string; adminEmail: string };
    seo: { metaTitle: string; metaDescription: string; metaKeywords: string; ogImageUrl: string; googleAnalyticsId: string };
    social: { github: string; linkedin: string; twitter: string; facebook: string; instagram: string; youtube: string };
    contact: { contactEmail: string; phone: string; whatsapp: string; address: string; mapEmbedLink: string };
    homepage: { heroTitle: string; heroSubtitle: string; heroDescription: string; heroImageUrl: string; resumeUrl: string; ctaText: string; ctaLink: string };
    theme: { primaryColor: string; darkMode: boolean };
  } | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  saving: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSettings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSettings.fulfilled, (state, action) => { state.loading = false; state.settings = action.payload; })
      .addCase(fetchSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      // Save
      .addCase(saveSettings.pending, (state) => { state.saving = true; })
      .addCase(saveSettings.fulfilled, (state, action) => { state.saving = false; state.settings = action.payload; })
      .addCase(saveSettings.rejected, (state, action) => { state.saving = false; state.error = action.payload as string; })
      // Upload file — patch the nested url back into state
      .addCase(uploadSettingFile.fulfilled, (state, action) => {
        if (!state.settings) return;
        const { url, field } = action.payload;
        if (field === "siteLogoUrl")  state.settings.general.siteLogoUrl   = url;
        if (field === "faviconUrl")   state.settings.general.faviconUrl    = url;
        if (field === "ogImageUrl")   state.settings.seo.ogImageUrl        = url;
        if (field === "heroImageUrl") state.settings.homepage.heroImageUrl  = url;
        if (field === "resumeUrl")    state.settings.homepage.resumeUrl     = url;
      });
  },
});

export default settingsSlice.reducer;
