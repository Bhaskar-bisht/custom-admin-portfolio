/** @format */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import { settingsReducer, analyticsReducer, apiLogsReducer } from "./slices/extraSlices";
import {
    projectsResource,
    blogsResource,
    technologiesResource,
    categoriesResource,
    skillsResource,
    experiencesResource,
    educationsResource,
    certificationsResource,
    achievementsResource,
    servicesResource,
    testimonialsResource,
    socialLinksResource,
    tagsResource,
    contactsResource,
    usersResource,
    seoMetadataResource,
} from "./slices/resourceSlices";

const isProd = import.meta.env.PROD;

const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        projects: projectsResource.slice.reducer,
        blogs: blogsResource.slice.reducer,
        technologies: technologiesResource.slice.reducer,
        categories: categoriesResource.slice.reducer,
        skills: skillsResource.slice.reducer,
        experiences: experiencesResource.slice.reducer,
        educations: educationsResource.slice.reducer,
        certifications: certificationsResource.slice.reducer,
        achievements: achievementsResource.slice.reducer,
        services: servicesResource.slice.reducer,
        testimonials: testimonialsResource.slice.reducer,
        socialLinks: socialLinksResource.slice.reducer,
        tags: tagsResource.slice.reducer,
        contacts: contactsResource.slice.reducer,
        users: usersResource.slice.reducer,
        seoMetadata: seoMetadataResource.slice.reducer,
        settings: settingsReducer,
        analytics: analyticsReducer,
        apiLogs: apiLogsReducer,
    },
    devTools: !isProd,
});

export default store;
