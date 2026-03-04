/** @format */

import { format } from "date-fns";
import { BarChart3, Eye, Heart, RefreshCw, Trash2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import ConfirmDialog from "../../components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton, Textarea } from "../../components/ui/misc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
    deleteSetting,
    fetchAnalytics,
    fetchAnalyticStats,
    fetchSettings,
    upsertSetting,
} from "../../store/slices/extraSlices";
import { seoMetadataResource, usersResource } from "../../store/slices/resourceSlices";
import { createResourcePage } from "../ResourcePage";

// ===== USERS =====
const userCols = [
    {
        key: "name",
        label: "User",
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
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                </div>
            </div>
        ),
    },
    {
        key: "role",
        label: "Role",
        render: (v) => (
            <Badge variant={v === "admin" ? "default" : "secondary"} className="text-[10px] capitalize">
                {v}
            </Badge>
        ),
    },
    {
        key: "availabilityStatus",
        label: "Status",
        render: (v) => {
            const c = { available: "success", busy: "warning", not_available: "destructive" };
            return (
                <Badge variant={c[v] || "secondary"} className="text-[10px] capitalize">
                    {v?.replace("_", " ")}
                </Badge>
            );
        },
    },
    { key: "currentPosition", label: "Position", render: (v) => <span className="text-xs">{v || "—"}</span> },
    {
        key: "createdAt",
        label: "Joined",
        render: (v) => (
            <span className="text-xs text-muted-foreground">{v ? format(new Date(v), "MMM d, yyyy") : "—"}</span>
        ),
    },
];

export const UsersPage = createResourcePage({
    stateKey: "users",
    actions: usersResource.actions,
    columns: userCols,
    FormModal: null,
    title: "Users",
});

// ===== SETTINGS =====
export function SettingsPage() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((s) => s.settings);
    const [editItem, setEditItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    useEffect(() => {
        dispatch(fetchSettings());
    }, []);

    const openEdit = (item) => {
        setEditItem(item);
        reset({
            key: item.key,
            value: String(item.value),
            type: item.type || "string",
            group: item.group || "general",
            description: item.description || "",
        });
        setModalOpen(true);
    };

    const openCreate = () => {
        setEditItem(null);
        reset({ key: "", value: "", type: "string", group: "general", description: "" });
        setModalOpen(true);
    };

    const onSubmit = async (data) => {
        try {
            await dispatch(upsertSetting({ key: editItem?.key || data.key, data })).unwrap();
            toast.success(editItem ? "Updated" : "Created");
            setModalOpen(false);
            dispatch(fetchSettings());
        } catch (e) {
            toast.error(e || "Failed");
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await dispatch(deleteSetting(deleteItem._id)).unwrap();
            toast.success("Deleted");
            setDeleteItem(null);
        } catch {
            toast.error("Failed");
        } finally {
            setDeleting(false);
        }
    };

    const grouped = items.reduce((acc, s) => {
        (acc[s.group] = acc[s.group] || []).push(s);
        return acc;
    }, {});

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button size="sm" onClick={openCreate} className="h-8 gap-1.5">
                    + New Setting
                </Button>
            </div>
            {loading ? (
                <Skeleton className="h-40 w-full" />
            ) : (
                Object.entries(grouped).map(([group, settings]) => (
                    <div key={group}>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                            {group}
                        </h3>
                        <div className="rounded-xl border overflow-hidden bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-xs">Key</TableHead>
                                        <TableHead className="text-xs">Value</TableHead>
                                        <TableHead className="text-xs">Type</TableHead>
                                        <TableHead className="text-xs">Description</TableHead>
                                        <TableHead className="text-xs w-16 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {settings.map((s) => (
                                        <TableRow key={s._id} className="cursor-pointer" onClick={() => openEdit(s)}>
                                            <TableCell>
                                                <code className="text-xs">{s.key}</code>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs truncate max-w-[150px] block">
                                                    {String(s.value)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px]">
                                                    {s.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">
                                                    {s.description || "—"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive"
                                                    onClick={() => setDeleteItem(s)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))
            )}

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editItem ? "Edit Setting" : "New Setting"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Key *</Label>
                            <Input
                                {...register("key", { required: true })}
                                className="h-8 text-sm font-mono"
                                disabled={!!editItem}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Value *</Label>
                            <Input {...register("value", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Type</Label>
                                <Select defaultValue={watch("type")} onValueChange={(v) => setValue("type", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["string", "number", "boolean", "json", "array"].map((t) => (
                                            <SelectItem key={t} value={t} className="text-sm">
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Group</Label>
                                <Select defaultValue={watch("group")} onValueChange={(v) => setValue("group", v)}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["general", "seo", "email", "social", "analytics", "other"].map((g) => (
                                            <SelectItem key={g} value={g} className="text-sm capitalize">
                                                {g}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Description</Label>
                            <Input {...register("description")} className="h-8 text-sm" />
                        </div>
                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <ConfirmDialog
                open={!!deleteItem}
                onClose={() => setDeleteItem(null)}
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}

// ===== ANALYTICS =====
export function AnalyticsPage() {
    const dispatch = useDispatch();
    const { items, stats, loading } = useSelector((s) => s.analytics);

    useEffect(() => {
        dispatch(fetchAnalyticStats());
        dispatch(fetchAnalytics({ page: 1, limit: 100 }));
    }, []);

    const eventColors = { view: "info", like: "success", share: "warning", click: "secondary", download: "default" };

    return (
        <div className="space-y-4">
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-blue-500" },
                        { label: "Total Likes", value: stats.totalLikes, icon: Heart, color: "text-red-500" },
                        {
                            label: "Event Types",
                            value: stats.breakdown?.length || 0,
                            icon: BarChart3,
                            color: "text-purple-500",
                        },
                        { label: "Recent Events", value: items.length, icon: TrendingUp, color: "text-green-500" },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <Card key={label}>
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-muted">
                                    <Icon className={`w-4 h-4 ${color}`} />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{value?.toLocaleString() || 0}</p>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {stats?.breakdown && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {stats.breakdown.map((b) => (
                        <Card key={b._id}>
                            <CardContent className="p-3 text-center">
                                <p className="text-2xl font-bold">{b.count}</p>
                                <Badge
                                    variant={eventColors[b._id] || "secondary"}
                                    className="text-[10px] mt-1 capitalize"
                                >
                                    {b._id}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Events</h3>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1"
                    onClick={() => dispatch(fetchAnalytics({ page: 1, limit: 100 }))}
                >
                    <RefreshCw className="w-3 h-3" />
                </Button>
            </div>

            <div className="rounded-xl border overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-xs">Event</TableHead>
                            <TableHead className="text-xs">Type</TableHead>
                            <TableHead className="text-xs">Device</TableHead>
                            <TableHead className="text-xs">Country</TableHead>
                            <TableHead className="text-xs">IP</TableHead>
                            <TableHead className="text-xs">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <TableRow key={i}>
                                      {Array(6)
                                          .fill(0)
                                          .map((_, j) => (
                                              <TableCell key={j}>
                                                  <Skeleton className="h-3 w-16" />
                                              </TableCell>
                                          ))}
                                  </TableRow>
                              ))
                            : items.slice(0, 50).map((a) => (
                                  <TableRow key={a._id}>
                                      <TableCell>
                                          <Badge
                                              variant={eventColors[a.eventType] || "secondary"}
                                              className="text-[10px] capitalize"
                                          >
                                              {a.eventType}
                                          </Badge>
                                      </TableCell>
                                      <TableCell>
                                          <span className="text-xs">{a.trackableType}</span>
                                      </TableCell>
                                      <TableCell>
                                          <Badge variant="outline" className="text-[10px] capitalize">
                                              {a.deviceType}
                                          </Badge>
                                      </TableCell>
                                      <TableCell>
                                          <span className="text-xs">{a.country || "—"}</span>
                                      </TableCell>
                                      <TableCell>
                                          <span className="text-xs font-mono text-muted-foreground">
                                              {a.ipAddress || "—"}
                                          </span>
                                      </TableCell>
                                      <TableCell>
                                          <span className="text-xs text-muted-foreground">
                                              {a.createdAt ? format(new Date(a.createdAt), "MMM d HH:mm") : "—"}
                                          </span>
                                      </TableCell>
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// ===== SEO METADATA =====
const seoCols = [
    {
        key: "seoableType",
        label: "Type",
        render: (v) => (
            <Badge variant="outline" className="text-[10px]">
                {v}
            </Badge>
        ),
    },
    { key: "title", label: "Title", render: (v) => <span className="text-sm font-medium">{v || "—"}</span> },
    {
        key: "description",
        label: "Description",
        render: (v) => <span className="text-xs text-muted-foreground truncate max-w-[200px] block">{v || "—"}</span>,
    },
    {
        key: "robots",
        label: "Robots",
        render: (v) => <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{v}</code>,
    },
    { key: "twitterCard", label: "Twitter", render: (v) => <span className="text-xs">{v || "—"}</span> },
];

function SeoModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      seoableType: item.seoableType || "Project",
                      seoableId: item.seoableId || "",
                      title: item.title || "",
                      description: item.description || "",
                      keywords: item.keywords || "",
                      twitterCard: item.twitterCard || "summary_large_image",
                      robots: item.robots || "index,follow",
                      canonicalUrl: item.canonicalUrl || "",
                  }
                : { seoableType: "Project", twitterCard: "summary_large_image", robots: "index,follow" },
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
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit SEO Metadata" : "New SEO Metadata"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Resource Type</Label>
                            <Select
                                defaultValue={watch("seoableType")}
                                onValueChange={(v) => setValue("seoableType", v)}
                            >
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["Project", "Blog", "User", "Service"].map((t) => (
                                        <SelectItem key={t} value={t} className="text-sm">
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Resource ID *</Label>
                            <Input
                                {...register("seoableId", { required: true })}
                                placeholder="MongoDB ObjectId"
                                className="h-8 text-sm font-mono"
                            />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">SEO Title</Label>
                            <Input {...register("title")} maxLength={60} className="h-8 text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Meta Description</Label>
                            <Textarea {...register("description")} rows={2} maxLength={160} className="text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Keywords</Label>
                            <Input {...register("keywords")} placeholder="react, nodejs, ..." className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Twitter Card</Label>
                            <Select
                                defaultValue={watch("twitterCard")}
                                onValueChange={(v) => setValue("twitterCard", v)}
                            >
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["summary", "summary_large_image", "app", "player"].map((t) => (
                                        <SelectItem key={t} value={t} className="text-sm">
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Robots</Label>
                            <Select defaultValue={watch("robots")} onValueChange={(v) => setValue("robots", v)}>
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"].map(
                                        (r) => (
                                            <SelectItem key={r} value={r} className="text-xs">
                                                {r}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Canonical URL</Label>
                            <Input {...register("canonicalUrl")} placeholder="https://" className="h-8 text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">OG Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setValue("ogImage", e.target.files[0])}
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

export const SeoMetadataPage = createResourcePage({
    stateKey: "seoMetadata",
    actions: seoMetadataResource.actions,
    columns: seoCols,
    FormModal: SeoModal,
    title: "SEO Metadata",
});
