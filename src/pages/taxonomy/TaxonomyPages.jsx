/** @format */

import { Star } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/misc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { categoriesResource, tagsResource, technologiesResource } from "../../store/slices/resourceSlices";
import { createResourcePage } from "../ResourcePage";

// ==================== TECHNOLOGY ====================
const techColumns = [
    {
        key: "name",
        label: "Name",
        render: (v, row) => (
            <div className="flex items-center gap-2">
                {row.logo?.url && <img src={row.logo.url} alt="" className="w-6 h-6 rounded object-contain shrink-0" />}
                <span className="font-medium text-sm">{v}</span>
            </div>
        ),
    },
    {
        key: "category",
        label: "Category",
        render: (v) => (
            <Badge variant="outline" className="text-[10px] capitalize">
                {v}
            </Badge>
        ),
    },
    {
        key: "proficiencyLevel",
        label: "Level",
        render: (v) => (v ? <span className="text-xs capitalize">{v}</span> : "—"),
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
];

function TechModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      name: item.name || "",
                      description: item.description || "",
                      category: item.category || "other",
                      proficiencyLevel: item.proficiencyLevel || "",
                      colorCode: item.colorCode || "",
                      isFeatured: item.isFeatured || false,
                      displayOrder: item.displayOrder || 0,
                      officialUrl: item.officialUrl || "",
                  }
                : { category: "other", isFeatured: false, displayOrder: 0 },
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
                    <DialogTitle>{item ? "Edit Technology" : "New Technology"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Name *</Label>
                            <Input
                                {...register("name", { required: true })}
                                placeholder="React, Node.js..."
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Category</Label>
                            <Select defaultValue={watch("category")} onValueChange={(v) => setValue("category", v)}>
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["frontend", "backend", "database", "devops", "mobile", "design", "other"].map(
                                        (c) => (
                                            <SelectItem key={c} value={c} className="text-sm capitalize">
                                                {c}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Proficiency</Label>
                            <Select
                                defaultValue={watch("proficiencyLevel")}
                                onValueChange={(v) => setValue("proficiencyLevel", v)}
                            >
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {["beginner", "intermediate", "advanced", "expert"].map((l) => (
                                        <SelectItem key={l} value={l} className="text-sm capitalize">
                                            {l}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Color Code</Label>
                            <Input {...register("colorCode")} placeholder="#3B82F6" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Display Order</Label>
                            <Input
                                {...register("displayOrder", { valueAsNumber: true })}
                                type="number"
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Official URL</Label>
                            <Input {...register("officialUrl")} placeholder="https://..." className="h-8 text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Logo</Label>
                            {item?.logo?.url && (
                                <div className="flex items-center gap-2 mb-1">
                                    <img
                                        src={item.logo.url}
                                        alt="logo"
                                        className="w-10 h-10 rounded object-contain border p-1"
                                    />
                                    <span className="text-[10px] text-muted-foreground">Current logo</span>
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setValue("logo", e.target.files[0])}
                                className="h-8 text-sm"
                            />
                            <p className="text-[10px] text-muted-foreground">Leave empty to keep existing logo</p>
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Description</Label>
                            <Textarea {...register("description")} rows={2} className="text-sm" />
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

export const TechnologiesPage = createResourcePage({
    stateKey: "technologies",
    actions: technologiesResource.actions,
    columns: techColumns,
    FormModal: TechModal,
    title: "Technologies",
    extraActions: [{ label: "Toggle Featured", action: "toggle-featured", icon: Star }],
});

// ==================== CATEGORIES ====================
const catColumns = [
    {
        key: "name",
        label: "Name",
        render: (v, row) => (
            <div className="flex items-center gap-2">
                {row.iconImage?.url && (
                    <img src={row.iconImage.url} alt="" className="w-6 h-6 rounded object-contain" />
                )}
                <span className="font-medium text-sm">{v}</span>
            </div>
        ),
    },
    { key: "slug", label: "Slug", render: (v) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{v}</code> },
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

function CategoryModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      name: item.name || "",
                      description: item.description || "",
                      colorCode: item.colorCode || "",
                      displayOrder: item.displayOrder || 0,
                      isActive: item.isActive ?? true,
                  }
                : { isActive: true, displayOrder: 0 },
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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Category" : "New Category"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Name *</Label>
                        <Input {...register("name", { required: true })} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Description</Label>
                        <Textarea {...register("description")} rows={2} className="text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Color Code</Label>
                            <Input {...register("colorCode")} placeholder="#3B82F6" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Display Order</Label>
                            <Input
                                {...register("displayOrder", { valueAsNumber: true })}
                                type="number"
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Icon Image</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setValue("iconImage", e.target.files[0])}
                            className="h-8 text-sm"
                        />
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

export const CategoriesPage = createResourcePage({
    stateKey: "categories",
    actions: categoriesResource.actions,
    columns: catColumns,
    FormModal: CategoryModal,
    title: "Categories",
});

// ==================== TAGS ====================
const tagColumns = [
    {
        key: "name",
        label: "Name",
        render: (v, row) => (
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: row.colorCode || "#3B82F6" }} />
                <span className="font-medium text-sm">{v}</span>
            </div>
        ),
    },
    { key: "slug", label: "Slug", render: (v) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{v}</code> },
    { key: "colorCode", label: "Color", render: (v) => <span className="text-xs font-mono">{v || "—"}</span> },
];

function TagModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset } = useForm();
    useEffect(() => {
        reset(item ? { name: item.name || "", colorCode: item.colorCode || "#3B82F6" } : { colorCode: "#3B82F6" });
    }, [item, open]);
    const onSubmit = async (data) => {
        await onSave(data);
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Tag" : "New Tag"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Name *</Label>
                        <Input
                            {...register("name", { required: true })}
                            className="h-8 text-sm"
                            placeholder="Tag name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Color Code</Label>
                        <div className="flex gap-2">
                            <Input {...register("colorCode")} className="h-8 text-sm font-mono" placeholder="#3B82F6" />
                            <input
                                type="color"
                                {...register("colorCode")}
                                className="h-8 w-10 rounded border border-input cursor-pointer"
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

export const TagsPage = createResourcePage({
    stateKey: "tags",
    actions: tagsResource.actions,
    columns: tagColumns,
    FormModal: TagModal,
    title: "Tags",
});
