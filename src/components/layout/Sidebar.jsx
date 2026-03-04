/** @format */

import {
    Award,
    BarChart3,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Cpu,
    FileText,
    FolderKanban,
    Globe,
    GraduationCap,
    LayoutDashboard,
    Link2,
    LogOut,
    Mail,
    Menu,
    MessageSquare,
    Moon,
    ScrollText,
    Settings,
    Star,
    Sun,
    Tag,
    Tags,
    Users,
    Wrench,
    X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { logoutAdmin } from "../../store/slices/authSlice";
import { toggleTheme } from "../../store/slices/themeSlice";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const navSections = [
    { label: "Main", items: [{ name: "Dashboard", path: "/", icon: LayoutDashboard }] },
    {
        label: "Content",
        items: [
            { name: "Projects", path: "/projects", icon: FolderKanban },
            { name: "Blogs", path: "/blogs", icon: FileText },
            { name: "Services", path: "/services", icon: Wrench },
        ],
    },
    {
        label: "Profile",
        items: [
            { name: "Experience", path: "/experiences", icon: Briefcase },
            { name: "Education", path: "/educations", icon: GraduationCap },
            { name: "Skills", path: "/skills", icon: Cpu },
            { name: "Certifications", path: "/certifications", icon: Award },
            { name: "Achievements", path: "/achievements", icon: Star },
        ],
    },
    {
        label: "Taxonomy",
        items: [
            { name: "Technologies", path: "/technologies", icon: Cpu },
            { name: "Categories", path: "/categories", icon: Tag },
            { name: "Tags", path: "/tags", icon: Tags },
        ],
    },
    {
        label: "Engagement",
        items: [
            { name: "Testimonials", path: "/testimonials", icon: MessageSquare },
            { name: "Contacts", path: "/contacts", icon: Mail },
            { name: "Social Links", path: "/social-links", icon: Link2 },
        ],
    },
    {
        label: "System",
        items: [
            { name: "Users", path: "/users", icon: Users },
            { name: "SEO Metadata", path: "/seo-metadata", icon: Globe },
            { name: "Settings", path: "/settings", icon: Settings },
            { name: "Analytics", path: "/analytics", icon: BarChart3 },
            { name: "API Logs", path: "/api-logs", icon: ScrollText },
        ],
    },
];

function NavItem({ item, collapsed, onNavigate }) {
    const Icon = item.icon;
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <NavLink
                        to={item.path}
                        end={item.path === "/"}
                        onClick={onNavigate}
                        style={{ display: "flex", alignItems: "center", gap: "12px" }}
                        className={({ isActive }) =>
                            cn(
                                "w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                                collapsed ? "justify-center" : "justify-start",
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                            )
                        }
                    >
                        <Icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                    </NavLink>
                </TooltipTrigger>
                {collapsed && (
                    <TooltipContent side="right" className="z-50">
                        {item.name}
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
}

function SidebarInner({ collapsed, setCollapsed, onNavigate }) {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const theme = useSelector((s) => s.theme.mode);

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div
                className={cn(
                    "flex items-center h-14 border-b border-gray-200 dark:border-gray-700 shrink-0 px-4",
                    collapsed ? "justify-center" : "justify-between",
                )}
            >
                {!collapsed && (
                    <span className="font-bold text-base tracking-tight text-gray-900 dark:text-white">
                        <span className="text-gray-400">&lt;</span>
                        bhaskar
                        <span className="text-gray-400">/&gt;</span>
                    </span>
                )}
                {setCollapsed && (
                    <button
                        onClick={() => setCollapsed((p) => !p)}
                        className="hidden md:flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto overflow-x-hidden">
                {navSections.map((section) => (
                    <div key={section.label}>
                        {!collapsed && (
                            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                {section.label}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => (
                                <NavItem key={item.path} item={item} collapsed={collapsed} onNavigate={onNavigate} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-2 space-y-1 shrink-0">
                {/* Theme toggle */}
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className={cn(
                                    "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors",
                                    collapsed ? "justify-center px-2" : "justify-start",
                                )}
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-4 h-4 shrink-0" />
                                ) : (
                                    <Moon className="w-4 h-4 shrink-0" />
                                )}
                                {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
                            </button>
                        </TooltipTrigger>
                        {collapsed && (
                            <TooltipContent side="right">
                                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>

                {/* User + Logout */}
                {!collapsed ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group cursor-default">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                            {user?.name?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate text-gray-900 dark:text-white">
                                {user?.name || "Admin"}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user?.email || ""}</p>
                        </div>
                        <button
                            onClick={() => dispatch(logoutAdmin())}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Logout"
                        >
                            <LogOut className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                        </button>
                    </div>
                ) : (
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => dispatch(logoutAdmin())}
                                    className="flex items-center justify-center w-full rounded-lg px-2 py-2 text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Logout</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    );
}

export default function Sidebar({ collapsed, setCollapsed }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen((p) => !p)}
                className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm" onClick={closeMobile} />
            )}

            {/* Desktop sidebar */}
            <aside
                className={cn(
                    "hidden md:flex flex-col fixed left-0 top-0 h-screen z-40 overflow-hidden",
                    "bg-white dark:bg-gray-900",
                    "border-r border-gray-200 dark:border-gray-700",
                    "transition-all duration-300",
                    collapsed ? "w-14" : "w-56",
                )}
            >
                <SidebarInner collapsed={collapsed} setCollapsed={setCollapsed} onNavigate={undefined} />
            </aside>

            {/* Mobile sidebar */}
            <aside
                className={cn(
                    "md:hidden flex flex-col fixed left-0 top-0 h-screen z-40 w-56 overflow-hidden",
                    "bg-white dark:bg-gray-900",
                    "border-r border-gray-200 dark:border-gray-700",
                    "transition-transform duration-300",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <SidebarInner collapsed={false} setCollapsed={null} onNavigate={closeMobile} />
            </aside>
        </>
    );
}
