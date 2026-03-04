/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const createResourceSlice = (name, endpoint) => {
    const fetchAll = createAsyncThunk(`${name}/fetchAll`, async (params = {}, { rejectWithValue }) => {
        try {
            const res = await api.get(endpoint, { params });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || `Failed to fetch ${name}`);
        }
    });

    const fetchOne = createAsyncThunk(`${name}/fetchOne`, async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`${endpoint}/${id}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || `Failed to fetch ${name}`);
        }
    });

    const createOne = createAsyncThunk(`${name}/create`, async (data, { rejectWithValue }) => {
        try {
            const isFormData = data instanceof FormData;
            const res = await api.post(
                endpoint,
                data,
                isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {},
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || `Failed to create ${name}`);
        }
    });

    const updateOne = createAsyncThunk(`${name}/update`, async ({ id, data }, { rejectWithValue }) => {
        try {
            const isFormData = data instanceof FormData;
            const res = await api.put(
                `${endpoint}/${id}`,
                data,
                isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {},
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || `Failed to update ${name}`);
        }
    });

    const deleteOne = createAsyncThunk(`${name}/delete`, async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${endpoint}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || `Failed to delete ${name}`);
        }
    });

    const patchOne = createAsyncThunk(`${name}/patch`, async ({ id, action, data = {} }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`${endpoint}/${id}/${action}`, data);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || `Failed to update ${name}`);
        }
    });

    const slice = createSlice({
        name,
        initialState: {
            items: [],
            current: null,
            pagination: null,
            loading: false,
            saving: false,
            error: null,
        },
        reducers: {
            clearCurrent: (state) => {
                state.current = null;
            },
            clearError: (state) => {
                state.error = null;
            },
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchAll.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchAll.fulfilled, (state, action) => {
                    state.loading = false;
                    state.items = action.payload.data || [];
                    state.pagination = action.payload.pagination || null;
                })
                .addCase(fetchAll.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(fetchOne.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchOne.fulfilled, (state, action) => {
                    state.loading = false;
                    state.current = action.payload;
                })
                .addCase(fetchOne.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(createOne.pending, (state) => {
                    state.saving = true;
                })
                .addCase(createOne.fulfilled, (state, action) => {
                    state.saving = false;
                    if (action.payload) state.items.unshift(action.payload);
                })
                .addCase(createOne.rejected, (state, action) => {
                    state.saving = false;
                    state.error = action.payload;
                })
                .addCase(updateOne.pending, (state) => {
                    state.saving = true;
                })
                .addCase(updateOne.fulfilled, (state, action) => {
                    state.saving = false;
                    if (action.payload) {
                        const idx = state.items.findIndex((i) => i._id === action.payload._id);
                        if (idx !== -1) state.items[idx] = action.payload;
                    }
                })
                .addCase(updateOne.rejected, (state, action) => {
                    state.saving = false;
                    state.error = action.payload;
                })
                .addCase(deleteOne.fulfilled, (state, action) => {
                    state.items = state.items.filter((i) => i._id !== action.payload);
                })
                .addCase(patchOne.fulfilled, (state, action) => {
                    if (action.payload) {
                        const idx = state.items.findIndex((i) => i._id === action.payload._id);
                        if (idx !== -1) state.items[idx] = action.payload;
                    }
                });
        },
    });

    return {
        slice,
        actions: { fetchAll, fetchOne, createOne, updateOne, deleteOne, patchOne, ...slice.actions },
    };
};

export const projectsResource = createResourceSlice("projects", "/admin/projects");
export const blogsResource = createResourceSlice("blogs", "/admin/blogs");
export const technologiesResource = createResourceSlice("technologies", "/admin/technologies");
export const categoriesResource = createResourceSlice("categories", "/admin/categories");
export const skillsResource = createResourceSlice("skills", "/admin/skills");
export const experiencesResource = createResourceSlice("experiences", "/admin/experiences");
export const educationsResource = createResourceSlice("educations", "/admin/educations");
export const certificationsResource = createResourceSlice("certifications", "/admin/certifications");
export const achievementsResource = createResourceSlice("achievements", "/admin/achievements");
export const servicesResource = createResourceSlice("services", "/admin/services");
export const testimonialsResource = createResourceSlice("testimonials", "/admin/testimonials");
export const socialLinksResource = createResourceSlice("socialLinks", "/admin/social-links");
export const tagsResource = createResourceSlice("tags", "/admin/tags");
export const contactsResource = createResourceSlice("contacts", "/admin/contacts");
export const usersResource = createResourceSlice("users", "/admin/users");
export const seoMetadataResource = createResourceSlice("seoMetadata", "/admin/seo-metadata");
