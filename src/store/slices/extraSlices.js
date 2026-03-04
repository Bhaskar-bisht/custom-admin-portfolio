/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchSettings = createAsyncThunk("settings/fetchAll", async (params = {}, { rejectWithValue }) => {
    try {
        const res = await api.get("/admin/settings", { params });
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});
export const upsertSetting = createAsyncThunk("settings/upsert", async ({ key, data }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/admin/settings/key/${key}`, data);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});
export const deleteSetting = createAsyncThunk("settings/delete", async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/admin/settings/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});

const settingsSlice = createSlice({
    name: "settings",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchSettings.pending, (s) => {
            s.loading = true;
        })
            .addCase(fetchSettings.fulfilled, (s, a) => {
                s.loading = false;
                s.items = a.payload || [];
            })
            .addCase(fetchSettings.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload;
            })
            .addCase(upsertSetting.fulfilled, (s, a) => {
                const idx = s.items.findIndex((i) => i.key === a.payload.key);
                if (idx !== -1) s.items[idx] = a.payload;
                else s.items.push(a.payload);
            })
            .addCase(deleteSetting.fulfilled, (s, a) => {
                s.items = s.items.filter((i) => i._id !== a.payload);
            });
    },
});

export const fetchAnalytics = createAsyncThunk("analytics/fetchAll", async (params = {}, { rejectWithValue }) => {
    try {
        const res = await api.get("/admin/analytics", { params });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});
export const fetchAnalyticStats = createAsyncThunk("analytics/stats", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/admin/analytics/stats");
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});

const analyticsSlice = createSlice({
    name: "analytics",
    initialState: { items: [], stats: null, pagination: null, loading: false },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchAnalytics.pending, (s) => {
            s.loading = true;
        })
            .addCase(fetchAnalytics.fulfilled, (s, a) => {
                s.loading = false;
                s.items = a.payload.data || [];
                s.pagination = a.payload.pagination;
            })
            .addCase(fetchAnalytics.rejected, (s) => {
                s.loading = false;
            })
            .addCase(fetchAnalyticStats.fulfilled, (s, a) => {
                s.stats = a.payload;
            });
    },
});

export const fetchApiLogs = createAsyncThunk("apiLogs/fetchAll", async (params = {}, { rejectWithValue }) => {
    try {
        const res = await api.get("/admin/api-logs", { params });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});
export const fetchApiLogStats = createAsyncThunk("apiLogs/stats", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/admin/api-logs/stats");
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});
export const fetchApiLogById = createAsyncThunk("apiLogs/fetchOne", async (id, { rejectWithValue }) => {
    try {
        const res = await api.get(`/admin/api-logs/${id}`);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});
export const deleteApiLog = createAsyncThunk("apiLogs/delete", async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/admin/api-logs/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});
export const deleteAllApiLogs = createAsyncThunk("apiLogs/deleteAll", async (_, { rejectWithValue }) => {
    try {
        await api.delete("/admin/api-logs/bulk/all");
        return true;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});

const apiLogsSlice = createSlice({
    name: "apiLogs",
    initialState: { items: [], current: null, stats: null, pagination: null, loading: false },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchApiLogs.pending, (s) => {
            s.loading = true;
        })
            .addCase(fetchApiLogs.fulfilled, (s, a) => {
                s.loading = false;
                s.items = a.payload.data || [];
                s.pagination = a.payload.pagination;
            })
            .addCase(fetchApiLogs.rejected, (s) => {
                s.loading = false;
            })
            .addCase(fetchApiLogStats.fulfilled, (s, a) => {
                s.stats = a.payload;
            })
            .addCase(fetchApiLogById.fulfilled, (s, a) => {
                s.current = a.payload;
            })
            .addCase(deleteApiLog.fulfilled, (s, a) => {
                s.items = s.items.filter((i) => i._id !== a.payload);
            })
            .addCase(deleteAllApiLogs.fulfilled, (s) => {
                s.items = [];
            });
    },
});

export const settingsReducer = settingsSlice.reducer;
export const analyticsReducer = analyticsSlice.reducer;
export const apiLogsReducer = apiLogsSlice.reducer;
