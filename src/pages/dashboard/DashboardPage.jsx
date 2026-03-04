/** @format */

import {
    Award,
    Briefcase,
    Cpu,
    FileText,
    FolderKanban,
    GraduationCap,
    Link2,
    Mail,
    MessageSquare,
    Star,
    Tag,
    Tags,
    Users,
    Wrench,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { fetchAnalyticStats } from "../../store/slices/extraSlices";
import {
    achievementsResource,
    blogsResource,
    categoriesResource,
    certificationsResource,
    contactsResource,
    educationsResource,
    experiencesResource,
    projectsResource,
    servicesResource,
    skillsResource,
    socialLinksResource,
    tagsResource,
    technologiesResource,
    testimonialsResource,
    usersResource,
} from "../../store/slices/resourceSlices";

const statCards = [
    {
        label: "Projects",
        key: "projects",
        path: "/projects",
        icon: FolderKanban,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        actions: projectsResource.actions,
    },
    {
        label: "Blogs",
        key: "blogs",
        path: "/blogs",
        icon: FileText,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-950/30",
        actions: blogsResource.actions,
    },
    {
        label: "Skills",
        key: "skills",
        path: "/skills",
        icon: Cpu,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-950/30",
        actions: skillsResource.actions,
    },
    {
        label: "Experience",
        key: "experiences",
        path: "/experiences",
        icon: Briefcase,
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-950/30",
        actions: experiencesResource.actions,
    },
    {
        label: "Education",
        key: "educations",
        path: "/educations",
        icon: GraduationCap,
        color: "text-sky-500",
        bg: "bg-sky-50 dark:bg-sky-950/30",
        actions: educationsResource.actions,
    },
    {
        label: "Certifications",
        key: "certifications",
        path: "/certifications",
        icon: Award,
        color: "text-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-950/30",
        actions: certificationsResource.actions,
    },
    {
        label: "Achievements",
        key: "achievements",
        path: "/achievements",
        icon: Star,
        color: "text-red-500",
        bg: "bg-red-50 dark:bg-red-950/30",
        actions: achievementsResource.actions,
    },
    {
        label: "Testimonials",
        key: "testimonials",
        path: "/testimonials",
        icon: MessageSquare,
        color: "text-teal-500",
        bg: "bg-teal-50 dark:bg-teal-950/30",
        actions: testimonialsResource.actions,
    },
    {
        label: "Contacts",
        key: "contacts",
        path: "/contacts",
        icon: Mail,
        color: "text-indigo-500",
        bg: "bg-indigo-50 dark:bg-indigo-950/30",
        actions: contactsResource.actions,
    },
    {
        label: "Services",
        key: "services",
        path: "/services",
        icon: Wrench,
        color: "text-pink-500",
        bg: "bg-pink-50 dark:bg-pink-950/30",
        actions: servicesResource.actions,
    },
    {
        label: "Social Links",
        key: "socialLinks",
        path: "/social-links",
        icon: Link2,
        color: "text-cyan-500",
        bg: "bg-cyan-50 dark:bg-cyan-950/30",
        actions: socialLinksResource.actions,
    },
    {
        label: "Technologies",
        key: "technologies",
        path: "/technologies",
        icon: Cpu,
        color: "text-violet-500",
        bg: "bg-violet-50 dark:bg-violet-950/30",
        actions: technologiesResource.actions,
    },
    {
        label: "Categories",
        key: "categories",
        path: "/categories",
        icon: Tag,
        color: "text-rose-500",
        bg: "bg-rose-50 dark:bg-rose-950/30",
        actions: categoriesResource.actions,
    },
    {
        label: "Tags",
        key: "tags",
        path: "/tags",
        icon: Tags,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        actions: tagsResource.actions,
    },
    {
        label: "Users",
        key: "users",
        path: "/users",
        icon: Users,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        actions: usersResource.actions,
    },
];

export default function DashboardPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const state = useSelector((s) => s);
    const { stats } = useSelector((s) => s.analytics);

    useEffect(() => {
        // Fetch analytics stats
        dispatch(fetchAnalyticStats());

        // Fetch all resources so counts show up on dashboard
        statCards.forEach(({ actions }) => {
            dispatch(actions.fetchAll({ page: 1, limit: 1 }));
        });
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Welcome back 👋</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Here's an overview of your portfolio</p>
            </div>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Card className="border-0 bg-primary text-primary-foreground">
                        <CardContent className="p-4">
                            <p className="text-xs opacity-70">Total Views</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalViews?.toLocaleString() || 0}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-emerald-500 text-white">
                        <CardContent className="p-4">
                            <p className="text-xs opacity-70">Total Likes</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalLikes?.toLocaleString() || 0}</p>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2 md:col-span-1">
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">Event Types</p>
                            <div className="mt-2 space-y-1">
                                {stats.breakdown?.slice(0, 3).map((b) => (
                                    <div key={b._id} className="flex justify-between text-xs">
                                        <span className="capitalize text-muted-foreground">{b._id}</span>
                                        <span className="font-medium">{b.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Resources</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {statCards.map(({ label, key, path, icon: Icon, color, bg }) => {
                        const stateSlice = state[key];
                        // Use pagination.total if available, else items.length
                        const count = stateSlice?.pagination?.total ?? stateSlice?.items?.length ?? 0;
                        return (
                            <Card
                                key={key}
                                onClick={() => navigate(path)}
                                className="group hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                            >
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                                        <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{count}</p>
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
