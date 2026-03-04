/** @format */

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { cn } from "../../lib/utils";

const routeTitles = {
    "/": "Dashboard",
    "/projects": "Projects",
    "/blogs": "Blogs",
    "/services": "Services",
    "/experiences": "Experience",
    "/educations": "Education",
    "/skills": "Skills",
    "/certifications": "Certifications",
    "/achievements": "Achievements",
    "/technologies": "Technologies",
    "/categories": "Categories",
    "/tags": "Tags",
    "/testimonials": "Testimonials",
    "/contacts": "Contact Messages",
    "/social-links": "Social Links",
    "/users": "Users",
    "/seo-metadata": "SEO Metadata",
    "/settings": "Settings",
    "/analytics": "Analytics",
    "/api-logs": "API Logs",
};

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const theme = useSelector((s) => s.theme.mode);

    useEffect(() => {
        if (theme === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [theme]);

    const title = routeTitles[location.pathname] || "Admin";

    return (
        <div className="min-h-screen bg-background">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className={cn("transition-all duration-300", collapsed ? "md:pl-14" : "md:pl-56")}>
                {/* Topbar */}
                <header className="sticky top-0 z-30 h-14 flex items-center border-b border-border bg-background/95 backdrop-blur px-4 md:px-6">
                    <div className="flex items-center gap-3 ml-8 md:ml-0">
                        <h1 className="text-base font-semibold">{title}</h1>
                    </div>
                </header>
                {/* Page content */}
                <main className="p-4 md:p-6 animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
