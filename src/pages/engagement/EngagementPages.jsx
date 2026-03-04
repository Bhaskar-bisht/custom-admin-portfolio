/** @format */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/misc";
import { Switch } from "../../components/ui/misc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import {
    blogsResource,
    servicesResource,
    testimonialsResource,
    socialLinksResource,
    contactsResource,
} from "../../store/slices/resourceSlices";
import { createResourcePage } from "../ResourcePage";
import { Star, Check } from "lucide-react";

// ===== BLOGS =====
const blogStatusColors = { draft: "secondary", published: "success", scheduled: "info", archived: "outline" };
const blogCols = [
    {
        key: "title",
        label: "Title",
        render: (v, row) => (
            <div className="flex items-center gap-2">
                {row.featuredImage?.url && (
                    <img src={row.featuredImage.url} alt="" className="w-10 h-7 rounded object-cover shrink-0" />
                )}
                <div>
                    <p className="font-medium text-sm">{v}</p>
                    <p className="text-xs text-muted-foreground">{row.readingTime} min read</p>
                </div>
            </div>
        ),
    },
    {
        key: "status",
        label: "Status",
        render: (v) => (
            <Badge variant={blogStatusColors[v] || "secondary"} className="text-[10px] capitalize">
                {v}
            </Badge>
        ),
    },
    {
        key: "isFeatured",
        label: "Featured",
        render: (v) =>
            v ? (
                <Badge variant="success" className="text-[10px]">
                    Yes
                </Badge>
            ) : (
                "—"
            ),
    },
    { key: "viewsCount", label: "Views", render: (v) => <span className="text-xs">{v || 0}</span> },
    {
        key: "createdAt",
        label: "Created",
        render: (v) => <span className="text-xs text-muted-foreground">{v ? format(new Date(v), "MMM d") : "—"}</span>,
    },
];

function BlogModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      title: item.title || "",
                      excerpt: item.excerpt || "",
                      body: item.body || "",
                      status: item.status || "draft",
                      isFeatured: item.isFeatured || false,
                      metaTitle: item.metaTitle || "",
                      metaDescription: item.metaDescription || "",
                  }
                : { status: "draft", isFeatured: false },
        );
    }, [item, open]);
    const onSubmit = async (data) => {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "") fd.append(k, v);
        });
        await onSave(fd);
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Blog" : "New Blog"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Title *</Label>
                            <Input {...register("title", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Excerpt</Label>
                            <Textarea
                                {...register("excerpt")}
                                rows={2}
                                className="text-sm"
                                placeholder="Short summary..."
                            />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Body *</Label>
                            <Textarea
                                {...register("body", { required: true })}
                                rows={6}
                                className="text-sm font-mono"
                                placeholder="Blog content..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Status</Label>
                            <Select defaultValue={watch("status")} onValueChange={(v) => setValue("status", v)}>
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["draft", "published", "scheduled", "archived"].map((s) => (
                                        <SelectItem key={s} value={s} className="text-sm capitalize">
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label className="text-xs">Featured</Label>
                            <Switch checked={watch("isFeatured")} onCheckedChange={(v) => setValue("isFeatured", v)} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Featured Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setValue("featuredImage", e.target.files[0])}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Meta Title</Label>
                            <Input {...register("metaTitle")} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Meta Description</Label>
                            <Input {...register("metaDescription")} className="h-8 text-sm" />
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

export const BlogsPage = createResourcePage({
    stateKey: "blogs",
    actions: blogsResource.actions,
    columns: blogCols,
    FormModal: BlogModal,
    title: "Blogs",
    extraActions: [{ label: "Toggle Featured", action: "toggle-featured", icon: Star }],
});

// ===== SERVICES =====
const svcCols = [
    {
        key: "title",
        label: "Title",
        render: (v, row) => (
            <div className="flex items-center gap-2">
                {row.thumbnail?.url && (
                    <img src={row.thumbnail.url} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                )}
                <span className="font-medium text-sm">{v}</span>
            </div>
        ),
    },
    {
        key: "pricingType",
        label: "Pricing",
        render: (v) => (
            <Badge variant="outline" className="text-[10px] capitalize">
                {v?.replace("_", " ")}
            </Badge>
        ),
    },
    { key: "startingPrice", label: "Price", render: (v) => (v ? <span className="text-xs">₹{v}</span> : "—") },
    {
        key: "isActive",
        label: "Status",
        render: (v) => (
            <Badge variant={v ? "success" : "secondary"} className="text-[10px]">
                {v ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        key: "isFeatured",
        label: "Featured",
        render: (v) =>
            v ? (
                <Badge variant="info" className="text-[10px]">
                    Yes
                </Badge>
            ) : (
                "—"
            ),
    },
];

function ServiceModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      title: item.title || "",
                      description: item.description || "",
                      pricingType: item.pricingType || "project_based",
                      startingPrice: item.startingPrice || "",
                      deliveryTime: item.deliveryTime || "",
                      isActive: item.isActive ?? true,
                      isFeatured: item.isFeatured || false,
                      displayOrder: item.displayOrder || 0,
                  }
                : { pricingType: "project_based", isActive: true, isFeatured: false, displayOrder: 0 },
        );
    }, [item, open]);
    const onSubmit = async (data) => {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "") fd.append(k, v);
        });
        await onSave(fd);
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Service" : "New Service"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Title *</Label>
                            <Input {...register("title", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Pricing Type</Label>
                            <Select
                                defaultValue={watch("pricingType")}
                                onValueChange={(v) => setValue("pricingType", v)}
                            >
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["fixed", "hourly", "project_based", "custom"].map((t) => (
                                        <SelectItem key={t} value={t} className="text-sm capitalize">
                                            {t.replace("_", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Starting Price</Label>
                            <Input
                                {...register("startingPrice", { valueAsNumber: true })}
                                type="number"
                                min={0}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Delivery Time</Label>
                            <Input {...register("deliveryTime")} placeholder="e.g. 2-3 weeks" className="h-8 text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Description</Label>
                            <Textarea {...register("description")} rows={3} className="text-sm" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label className="text-xs">Active</Label>
                            <Switch checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label className="text-xs">Featured</Label>
                            <Switch checked={watch("isFeatured")} onCheckedChange={(v) => setValue("isFeatured", v)} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Thumbnail</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setValue("thumbnail", e.target.files[0])}
                                className="h-8 text-sm"
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

export const ServicesPage = createResourcePage({
    stateKey: "services",
    actions: servicesResource.actions,
    columns: svcCols,
    FormModal: ServiceModal,
    title: "Services",
    extraActions: [{ label: "Toggle Featured", action: "toggle-featured", icon: Star }],
});

// ===== TESTIMONIALS =====
const testCols = [
    {
        key: "name",
        label: "Person",
        render: (v, row) => (
            <div className="flex items-center gap-2">
                {row.avatar?.url ? (
                    <img src={row.avatar.url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                        {v?.[0]}
                    </div>
                )}
                <div>
                    <p className="font-medium text-sm">{v}</p>
                    <p className="text-xs text-muted-foreground">
                        {row.position}
                        {row.company ? `, ${row.company}` : ""}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: "rating",
        label: "Rating",
        render: (v) => (
            <span className="text-xs">
                {"★".repeat(v)}
                {"☆".repeat(5 - v)}
            </span>
        ),
    },
    {
        key: "isApproved",
        label: "Approved",
        render: (v) => (
            <Badge variant={v ? "success" : "warning"} className="text-[10px]">
                {v ? "Yes" : "Pending"}
            </Badge>
        ),
    },
    {
        key: "isFeatured",
        label: "Featured",
        render: (v) =>
            v ? (
                <Badge variant="info" className="text-[10px]">
                    Yes
                </Badge>
            ) : (
                "—"
            ),
    },
];

function TestimonialModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      name: item.name || "",
                      position: item.position || "",
                      company: item.company || "",
                      content: item.content || "",
                      rating: item.rating || 5,
                      isApproved: item.isApproved || false,
                      isFeatured: item.isFeatured || false,
                  }
                : { rating: 5, isApproved: false, isFeatured: false },
        );
    }, [item, open]);
    const onSubmit = async (data) => {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "") fd.append(k, v);
        });
        await onSave(fd);
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Name *</Label>
                            <Input {...register("name", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Position</Label>
                            <Input {...register("position")} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Company</Label>
                            <Input {...register("company")} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Rating (1-5)</Label>
                            <Input
                                {...register("rating", { valueAsNumber: true })}
                                type="number"
                                min={1}
                                max={5}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Content *</Label>
                            <Textarea {...register("content", { required: true })} rows={3} className="text-sm" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label className="text-xs">Approved</Label>
                            <Switch checked={watch("isApproved")} onCheckedChange={(v) => setValue("isApproved", v)} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label className="text-xs">Featured</Label>
                            <Switch checked={watch("isFeatured")} onCheckedChange={(v) => setValue("isFeatured", v)} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Avatar</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setValue("avatar", e.target.files[0])}
                                className="h-8 text-sm"
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

export const TestimonialsPage = createResourcePage({
    stateKey: "testimonials",
    actions: testimonialsResource.actions,
    columns: testCols,
    FormModal: TestimonialModal,
    title: "Testimonials",
    extraActions: [
        { label: "Toggle Approved", action: "toggle-approved", icon: Check },
        { label: "Toggle Featured", action: "toggle-featured", icon: Star },
    ],
});

// ===== SOCIAL LINKS =====
const socialCols = [
    {
        key: "platform",
        label: "Platform",
        render: (v) => (
            <Badge variant="outline" className="text-[10px] capitalize">
                {v}
            </Badge>
        ),
    },
    { key: "username", label: "Username", render: (v) => <span className="text-xs">{v || "—"}</span> },
    {
        key: "url",
        label: "URL",
        render: (v) => (
            <a
                href={v}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline truncate max-w-[200px] block"
                onClick={(e) => e.stopPropagation()}
            >
                {v}
            </a>
        ),
    },
    {
        key: "isActive",
        label: "Status",
        render: (v) => (
            <Badge variant={v ? "success" : "secondary"} className="text-[10px]">
                {v ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    { key: "displayOrder", label: "Order", render: (v) => <span className="text-xs">{v}</span> },
];

const platforms = [
    "github",
    "linkedin",
    "twitter",
    "facebook",
    "instagram",
    "youtube",
    "behance",
    "dribbble",
    "medium",
    "dev",
    "stackoverflow",
    "codepen",
    "other",
];

function SocialModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      platform: item.platform || "github",
                      url: item.url || "",
                      username: item.username || "",
                      isActive: item.isActive ?? true,
                      displayOrder: item.displayOrder || 0,
                  }
                : { platform: "github", isActive: true, displayOrder: 0 },
        );
    }, [item, open]);
    const onSubmit = async (data) => {
        await onSave(data);
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Social Link" : "New Social Link"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Platform</Label>
                        <Select defaultValue={watch("platform")} onValueChange={(v) => setValue("platform", v)}>
                            <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {platforms.map((p) => (
                                    <SelectItem key={p} value={p} className="text-sm capitalize">
                                        {p}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">URL *</Label>
                        <Input
                            {...register("url", { required: true })}
                            placeholder="https://"
                            className="h-8 text-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Username</Label>
                        <Input {...register("username")} className="h-8 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Display Order</Label>
                            <Input
                                {...register("displayOrder", { valueAsNumber: true })}
                                type="number"
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label className="text-xs">Active</Label>
                        <Switch checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
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

export const SocialLinksPage = createResourcePage({
    stateKey: "socialLinks",
    actions: socialLinksResource.actions,
    columns: socialCols,
    FormModal: SocialModal,
    title: "Social Links",
});

// ===== CONTACTS =====
const contactCols = [
    { key: "name", label: "Name", render: (v) => <span className="font-medium text-sm">{v}</span> },
    { key: "email", label: "Email", render: (v) => <span className="text-xs">{v}</span> },
    {
        key: "subject",
        label: "Subject",
        render: (v) => <span className="text-xs truncate max-w-[200px] block">{v}</span>,
    },
    {
        key: "status",
        label: "Status",
        render: (v) => {
            const colors = { new: "destructive", read: "info", replied: "success", archived: "secondary" };
            return (
                <Badge variant={colors[v] || "secondary"} className="text-[10px] capitalize">
                    {v}
                </Badge>
            );
        },
    },
    {
        key: "createdAt",
        label: "Date",
        render: (v) => (
            <span className="text-xs text-muted-foreground">{v ? format(new Date(v), "MMM d, yyyy") : "—"}</span>
        ),
    },
];

export const ContactsPage = createResourcePage({
    stateKey: "contacts",
    actions: contactsResource.actions,
    columns: contactCols,
    FormModal: null,
    title: "Contacts",
    extraActions: [{ label: "Mark as Read", action: "read" }],
});
