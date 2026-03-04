/** @format */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./store";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import { TechnologiesPage, CategoriesPage, TagsPage } from "./pages/taxonomy/TaxonomyPages";
import {
    SkillsPage,
    ExperiencesPage,
    EducationsPage,
    CertificationsPage,
    AchievementsPage,
} from "./pages/profile/ProfilePages";
import {
    BlogsPage,
    ServicesPage,
    TestimonialsPage,
    SocialLinksPage,
    ContactsPage,
} from "./pages/engagement/EngagementPages";
import { UsersPage, SettingsPage, AnalyticsPage, SeoMetadataPage } from "./pages/system/SystemPages";
import ApiLogsPage from "./pages/apiLogs/ApiLogsPage";

export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardPage />} />
                        <Route path="projects" element={<ProjectsPage />} />
                        <Route path="blogs" element={<BlogsPage />} />
                        <Route path="services" element={<ServicesPage />} />
                        <Route path="experiences" element={<ExperiencesPage />} />
                        <Route path="educations" element={<EducationsPage />} />
                        <Route path="skills" element={<SkillsPage />} />
                        <Route path="certifications" element={<CertificationsPage />} />
                        <Route path="achievements" element={<AchievementsPage />} />
                        <Route path="technologies" element={<TechnologiesPage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route path="tags" element={<TagsPage />} />
                        <Route path="testimonials" element={<TestimonialsPage />} />
                        <Route path="contacts" element={<ContactsPage />} />
                        <Route path="social-links" element={<SocialLinksPage />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="seo-metadata" element={<SeoMetadataPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="api-logs" element={<ApiLogsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: { fontSize: "13px" },
                        success: { iconTheme: { primary: "#22c55e", secondary: "white" } },
                        error: { iconTheme: { primary: "#ef4444", secondary: "white" } },
                    }}
                />
            </BrowserRouter>
        </Provider>
    );
}
