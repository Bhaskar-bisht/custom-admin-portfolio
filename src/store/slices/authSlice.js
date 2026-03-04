/** @format */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const loginAdmin = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        const res = await api.post("/admin/auth/login", credentials);
        const { token, user } = res.data;
        localStorage.setItem("admin_token", token);
        return { token, user };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Login failed");
    }
});

export const getMe = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/admin/auth/me");
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
});

export const logoutAdmin = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await api.post("/admin/auth/logout");
        localStorage.removeItem("admin_token");
    } catch {
        localStorage.removeItem("admin_token");
    }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (data, { rejectWithValue }) => {
    try {
        const res = await api.put("/admin/auth/update-profile", data);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Update failed");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: localStorage.getItem("admin_token"),
        isAuthenticated: false,
        loading: false,
        initialized: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setInitialized: (state) => {
            state.initialized = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.initialized = true;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.initialized = true;
            })
            .addCase(getMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.initialized = true;
            })
            .addCase(getMe.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.initialized = true;
                state.token = null;
                localStorage.removeItem("admin_token");
            })
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.initialized = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
