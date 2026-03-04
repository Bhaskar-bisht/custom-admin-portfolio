/** @format */

import { format } from "date-fns";
import { Star } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch, Textarea } from "../../components/ui/misc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { projectsResource } from "../../store/slices/resourceSlices";
import { createResourcePage } from "../ResourcePage";

const statusColors = {
    completed: "success",
    in_progress: "info",
    planning: "warning",
    on_hold: "warning",
    cancelled: "destructive",
};

const columns = [
    {
        key: "title",
        label: "Title",
        render: (v, row) => (
            <div className="flex items-center gap-2">
                {row.thumbnail?.url && (
                    <img src={row.thumbnail.url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                )}
                <div>
                    <p className="font-medium text-sm">{v}</p>
                    <p className="text-xs text-muted-foreground">{row.projectType}</p>
                </div>
            </div>
        ),
    },
    {
        key: "status",
        label: "Status",
        render: (v) => (
            <Badge variant={statusColors[v] || "secondary"} className="capitalize text-[10px]">
                {v?.replace("_", " ")}
            </Badge>
        ),
    },
    {
        key: "featured",
        label: "Featured",
        render: (v) =>
            v ? (
                <Badge variant="success" className="text-[10px]">
                    Featured
                </Badge>
            ) : (
                <span className="text-muted-foreground text-xs">—</span>
            ),
    },
    {
        key: "isPublished",
        label: "Published",
        render: (v) =>
            v ? (
                <Badge variant="success" className="text-[10px]">
                    Live
                </Badge>
            ) : (
                <Badge variant="secondary" className="text-[10px]">
                    Draft
                </Badge>
            ),
    },
    {
        key: "gallery",
        label: "Gallery",
        render: (v) => <span className="text-xs text-muted-foreground">{v?.length || 0} images</span>,
    },
    {
        key: "createdAt",
        label: "Created",
        render: (v) =>
            v ? <span className="text-xs text-muted-foreground">{format(new Date(v), "MMM d, yyyy")}</span> : "—",
    },
];

// Small image preview component
function ImagePreview({ src, alt, className = "w-16 h-16" }) {
    return (
        <div className="relative group inline-block">
            <img
                src={src}
                alt={alt}
                className={`${className} rounded object-cover border border-gray-200 dark:border-gray-700`}
            />
        </div>
    );
}

function ProjectModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    useEffect(() => {
        if (item) {
            reset({
                title: item.title || "",
                shortDescription: item.shortDescription || "",
                fullDescription: item.fullDescription || "",
                projectType: item.projectType || "web",
                status: item.status || "completed",
                projectUrl: item.projectUrl || "",
                githubUrl: item.githubUrl || "",
                demoUrl: item.demoUrl || "",
                clientName: item.clientName || "",
                clientFeedback: item.clientFeedback || "",
                budgetRange: item.budgetRange || "",
                teamSize: item.teamSize || "",
                startedAt: item.startedAt ? item.startedAt.slice(0, 10) : "",
                completedAt: item.completedAt ? item.completedAt.slice(0, 10) : "",
                featured: item.featured || false,
                isPublished: item.isPublished || false,
                priority: item.priority || 0,
                metaTitle: item.metaTitle || "",
                metaDescription: item.metaDescription || "",
            });
        } else {
            reset({ projectType: "web", status: "completed", featured: false, isPublished: false, priority: 0 });
        }
    }, [item, open]);

    const onSubmit = async (data) => {
        const fd = new FormData();

        // Append all text fields
        const skipKeys = ["thumbnail", "banner", "gallery"];
        Object.entries(data).forEach(([k, v]) => {
            if (skipKeys.includes(k)) return;
            if (v !== undefined && v !== null && v !== "") fd.append(k, v);
        });

        // Thumbnail — single image
        const thumbnailFile = watch("thumbnail");
        if (thumbnailFile instanceof File) fd.append("thumbnail", thumbnailFile);

        // Banner — single image
        const bannerFile = watch("banner");
        if (bannerFile instanceof File) fd.append("banner", bannerFile);

        // Gallery — multiple images
        const galleryFiles = watch("gallery");
        if (galleryFiles && galleryFiles.length > 0) {
            Array.from(galleryFiles).forEach((file) => fd.append("gallery", file));
        }

        await onSave(fd);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Project" : "New Project"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Title *</Label>
                            <Input
                                {...register("title", { required: true })}
                                placeholder="Project title"
                                className="h-8 text-sm"
                            />
                        </div>

                        {/* Type + Status */}
                        <div className="space-y-1.5">
                            <Label className="text-xs">Type</Label>
                            <Select
                                defaultValue={watch("projectType")}
                                onValueChange={(v) => setValue("projectType", v)}
                            >
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["web", "mobile", "desktop", "api", "other"].map((t) => (
                                        <SelectItem key={t} value={t} className="text-sm capitalize">
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Status</Label>
                            <Select defaultValue={watch("status")} onValueChange={(v) => setValue("status", v)}>
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["planning", "in_progress", "completed", "on_hold", "cancelled"].map((s) => (
                                        <SelectItem key={s} value={s} className="text-sm capitalize">
                                            {s.replace("_", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Descriptions */}
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Short Description</Label>
                            <Textarea
                                {...register("shortDescription")}
                                placeholder="Brief description..."
                                rows={2}
                                className="text-sm"
                            />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Full Description</Label>
                            <Textarea
                                {...register("fullDescription")}
                                placeholder="Full description..."
                                rows={3}
                                className="text-sm"
                            />
                        </div>

                        {/* URLs */}
                        <div className="space-y-1.5">
                            <Label className="text-xs">Project URL</Label>
                            <Input {...register("projectUrl")} placeholder="https://" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">GitHub URL</Label>
                            <Input
                                {...register("githubUrl")}
                                placeholder="https://github.com/..."
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Demo URL</Label>
                            <Input {...register("demoUrl")} placeholder="https://" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Client Name</Label>
                            <Input {...register("clientName")} placeholder="Client name" className="h-8 text-sm" />
                        </div>

                        {/* Client feedback */}
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Client Feedback</Label>
                            <Textarea
                                {...register("clientFeedback")}
                                rows={2}
                                className="text-sm"
                                placeholder="Client feedback..."
                            />
                        </div>

                        {/* Budget + Team + Dates */}
                        <div className="space-y-1.5">
                            <Label className="text-xs">Budget Range</Label>
                            <Input
                                {...register("budgetRange")}
                                placeholder="e.g. $500 - $1000"
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Team Size</Label>
                            <Input
                                {...register("teamSize", { valueAsNumber: true })}
                                type="number"
                                min={1}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Started At</Label>
                            <Input {...register("startedAt")} type="date" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Completed At</Label>
                            <Input {...register("completedAt")} type="date" className="h-8 text-sm" />
                        </div>

                        {/* ── IMAGES SECTION ── */}
                        {/* Thumbnail — single */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Thumbnail <span className="text-muted-foreground font-normal">(1 image)</span>
                            </Label>
                            {item?.thumbnail?.url ? (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border">
                                    <ImagePreview src={item.thumbnail.url} alt="thumbnail" className="w-14 h-14" />
                                    <div className="text-[10px] text-muted-foreground">
                                        <p className="font-medium text-foreground">Current thumbnail</p>
                                        <p>Upload new to replace</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[10px] text-muted-foreground">No thumbnail yet</p>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                className="h-8 text-sm"
                                onChange={(e) => setValue("thumbnail", e.target.files[0])}
                            />
                        </div>

                        {/* Banner — single */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Banner <span className="text-muted-foreground font-normal">(1 image)</span>
                            </Label>
                            {item?.banner?.url ? (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border">
                                    <ImagePreview src={item.banner.url} alt="banner" className="w-14 h-14" />
                                    <div className="text-[10px] text-muted-foreground">
                                        <p className="font-medium text-foreground">Current banner</p>
                                        <p>Upload new to replace</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[10px] text-muted-foreground">No banner yet</p>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                className="h-8 text-sm"
                                onChange={(e) => setValue("banner", e.target.files[0])}
                            />
                        </div>

                        {/* Gallery — multiple */}
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Gallery <span className="text-muted-foreground font-normal">(multiple images)</span>
                            </Label>
                            {item?.gallery?.length > 0 ? (
                                <div className="p-2 rounded-lg bg-muted/50 border">
                                    <p className="text-[10px] text-muted-foreground mb-2">
                                        Current gallery ({item.gallery.length} images) — upload new ones to add/replace
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {item.gallery.map((img, i) => (
                                            <ImagePreview
                                                key={i}
                                                src={img.url}
                                                alt={img.name || `image-${i}`}
                                                className="w-14 h-14"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[10px] text-muted-foreground">No gallery images yet</p>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                className="h-8 text-sm"
                                onChange={(e) => setValue("gallery", e.target.files)}
                            />
                            <p className="text-[10px] text-muted-foreground">Hold Ctrl/Cmd to select multiple images</p>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <Label className="text-xs">Priority</Label>
                            <Input
                                {...register("priority", { valueAsNumber: true })}
                                type="number"
                                min={0}
                                className="h-8 text-sm"
                            />
                        </div>

                        {/* Meta */}
                        <div className="space-y-1.5">
                            <Label className="text-xs">Meta Title</Label>
                            <Input {...register("metaTitle")} className="h-8 text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Meta Description</Label>
                            <Input {...register("metaDescription")} className="h-8 text-sm" />
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <Label className="text-xs font-medium">Featured</Label>
                                <p className="text-[10px] text-muted-foreground">Show in featured section</p>
                            </div>
                            <Switch checked={watch("featured")} onCheckedChange={(v) => setValue("featured", v)} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <Label className="text-xs font-medium">Published</Label>
                                <p className="text-[10px] text-muted-foreground">Make visible publicly</p>
                            </div>
                            <Switch
                                checked={watch("isPublished")}
                                onCheckedChange={(v) => setValue("isPublished", v)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={saving}>
                            {saving ? "Saving..." : item ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default createResourcePage({
    stateKey: "projects",
    actions: projectsResource.actions,
    columns,
    FormModal: ProjectModal,
    title: "Projects",
    extraActions: [{ label: "Toggle Featured", action: "toggle-featured", icon: Star }],
});
