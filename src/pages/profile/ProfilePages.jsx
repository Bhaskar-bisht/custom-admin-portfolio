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
import {
    achievementsResource,
    certificationsResource,
    educationsResource,
    experiencesResource,
    skillsResource,
} from "../../store/slices/resourceSlices";
import { createResourcePage } from "../ResourcePage";

// ===== SKILLS =====
const skillCols = [
    {
        key: "technologyId",
        label: "Technology",
        render: (v) => (
            <div className="flex items-center gap-2">
                {v?.logo?.url && <img src={v.logo.url} alt="" className="w-5 h-5 rounded object-contain" />}
                <span className="font-medium text-sm">{v?.name || "—"}</span>
            </div>
        ),
    },
    {
        key: "proficiencyPercentage",
        label: "Proficiency",
        render: (v) => (
            <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
                </div>
                <span className="text-xs">{v}%</span>
            </div>
        ),
    },
    { key: "yearsOfExperience", label: "Years", render: (v) => <span className="text-xs">{v}y</span> },
    {
        key: "isPrimarySkill",
        label: "Primary",
        render: (v) =>
            v ? (
                <Badge variant="info" className="text-[10px]">
                    Primary
                </Badge>
            ) : (
                "—"
            ),
    },
];

function SkillModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      technologyId: item.technologyId?._id || item.technologyId || "",
                      proficiencyPercentage: item.proficiencyPercentage || 50,
                      yearsOfExperience: item.yearsOfExperience || 0,
                      isPrimarySkill: item.isPrimarySkill || false,
                      displayOrder: item.displayOrder || 0,
                  }
                : { proficiencyPercentage: 50, yearsOfExperience: 0, isPrimarySkill: false, displayOrder: 0 },
        );
    }, [item, open]);
    const onSubmit = async (data) => {
        await onSave(data);
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Skill" : "New Skill"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Technology ID *</Label>
                        <Input
                            {...register("technologyId", { required: true })}
                            placeholder="Technology ObjectId"
                            className="h-8 text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Proficiency %</Label>
                            <Input
                                {...register("proficiencyPercentage", { valueAsNumber: true })}
                                type="number"
                                min={0}
                                max={100}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Years of Experience</Label>
                            <Input
                                {...register("yearsOfExperience", { valueAsNumber: true })}
                                type="number"
                                min={0}
                                className="h-8 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <Label className="text-xs font-medium">Primary Skill</Label>
                        <Switch
                            checked={watch("isPrimarySkill")}
                            onCheckedChange={(v) => setValue("isPrimarySkill", v)}
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

export const SkillsPage = createResourcePage({
    stateKey: "skills",
    actions: skillsResource.actions,
    columns: skillCols,
    FormModal: SkillModal,
    title: "Skills",
});

// ===== EXPERIENCE =====
const expCols = [
    {
        key: "companyName",
        label: "Company",
        render: (v, row) => (
            <div className="flex items-center gap-2">
                {row.companyLogo?.url && (
                    <img src={row.companyLogo.url} alt="" className="w-7 h-7 rounded object-contain shrink-0" />
                )}
                <div>
                    <p className="font-medium text-sm">{v}</p>
                    <p className="text-xs text-muted-foreground">{row.position}</p>
                </div>
            </div>
        ),
    },
    {
        key: "employmentType",
        label: "Type",
        render: (v) => (
            <Badge variant="outline" className="text-[10px] capitalize">
                {v?.replace("_", " ")}
            </Badge>
        ),
    },
    {
        key: "isCurrent",
        label: "Status",
        render: (v) => (
            <Badge variant={v ? "success" : "secondary"} className="text-[10px]">
                {v ? "Current" : "Past"}
            </Badge>
        ),
    },
    {
        key: "startDate",
        label: "Period",
        render: (v, row) => (
            <span className="text-xs text-muted-foreground">
                {v ? format(new Date(v), "MMM yyyy") : "—"} –{" "}
                {row.isCurrent ? "Present" : row.endDate ? format(new Date(row.endDate), "MMM yyyy") : "—"}
            </span>
        ),
    },
];

function ExpModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      companyName: item.companyName || "",
                      position: item.position || "",
                      employmentType: item.employmentType || "full_time",
                      location: item.location || "",
                      startDate: item.startDate ? item.startDate.slice(0, 10) : "",
                      endDate: item.endDate ? item.endDate.slice(0, 10) : "",
                      isCurrent: item.isCurrent || false,
                      description: item.description || "",
                      companyUrl: item.companyUrl || "",
                      isRemote: item.isRemote || false,
                  }
                : { employmentType: "full_time", isCurrent: false, isRemote: false },
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
                    <DialogTitle>{item ? "Edit Experience" : "New Experience"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Company Name *</Label>
                            <Input {...register("companyName", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Position *</Label>
                            <Input {...register("position", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Employment Type</Label>
                            <Select
                                defaultValue={watch("employmentType")}
                                onValueChange={(v) => setValue("employmentType", v)}
                            >
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["full_time", "part_time", "contract", "freelance", "internship"].map((t) => (
                                        <SelectItem key={t} value={t} className="text-sm capitalize">
                                            {t.replace("_", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Location</Label>
                            <Input {...register("location")} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Start Date *</Label>
                            <Input {...register("startDate", { required: true })} type="date" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">End Date</Label>
                            <Input
                                {...register("endDate")}
                                type="date"
                                className="h-8 text-sm"
                                disabled={watch("isCurrent")}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label className="text-xs">Currently Working</Label>
                            <Switch checked={watch("isCurrent")} onCheckedChange={(v) => setValue("isCurrent", v)} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <Label className="text-xs">Remote</Label>
                            <Switch checked={watch("isRemote")} onCheckedChange={(v) => setValue("isRemote", v)} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Company URL</Label>
                            <Input {...register("companyUrl")} placeholder="https://" className="h-8 text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Description</Label>
                            <Textarea {...register("description")} rows={3} className="text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Company Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setValue("companyLogo", e.target.files[0])}
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

export const ExperiencesPage = createResourcePage({
    stateKey: "experiences",
    actions: experiencesResource.actions,
    columns: expCols,
    FormModal: ExpModal,
    title: "Experiences",
});

// ===== EDUCATION =====
const eduCols = [
    {
        key: "institutionName",
        label: "Institution",
        render: (v, row) => (
            <div className="flex items-center gap-2">
                {row.institutionLogo?.url && (
                    <img src={row.institutionLogo.url} alt="" className="w-7 h-7 rounded object-contain shrink-0" />
                )}
                <div>
                    <p className="font-medium text-sm">{v}</p>
                    <p className="text-xs text-muted-foreground">{row.degree}</p>
                </div>
            </div>
        ),
    },
    { key: "fieldOfStudy", label: "Field", render: (v) => <span className="text-xs">{v || "—"}</span> },
    { key: "grade", label: "Grade", render: (v) => <span className="text-xs">{v || "—"}</span> },
    {
        key: "isCurrent",
        label: "Status",
        render: (v) => (
            <Badge variant={v ? "success" : "secondary"} className="text-[10px]">
                {v ? "Current" : "Completed"}
            </Badge>
        ),
    },
];

function EduModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      institutionName: item.institutionName || "",
                      degree: item.degree || "",
                      fieldOfStudy: item.fieldOfStudy || "",
                      grade: item.grade || "",
                      startDate: item.startDate ? item.startDate.slice(0, 10) : "",
                      endDate: item.endDate ? item.endDate.slice(0, 10) : "",
                      isCurrent: item.isCurrent || false,
                      description: item.description || "",
                      location: item.location || "",
                  }
                : { isCurrent: false },
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
                    <DialogTitle>{item ? "Edit Education" : "New Education"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Institution *</Label>
                            <Input {...register("institutionName", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Degree *</Label>
                            <Input
                                {...register("degree", { required: true })}
                                className="h-8 text-sm"
                                placeholder="B.Tech, M.Sc..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Field of Study</Label>
                            <Input {...register("fieldOfStudy")} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Grade / CGPA</Label>
                            <Input {...register("grade")} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Location</Label>
                            <Input {...register("location")} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Start Date *</Label>
                            <Input {...register("startDate", { required: true })} type="date" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">End Date</Label>
                            <Input
                                {...register("endDate")}
                                type="date"
                                className="h-8 text-sm"
                                disabled={watch("isCurrent")}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 col-span-2">
                            <Label className="text-xs">Currently Studying</Label>
                            <Switch checked={watch("isCurrent")} onCheckedChange={(v) => setValue("isCurrent", v)} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Institution Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setValue("institutionLogo", e.target.files[0])}
                                className="h-8 text-sm"
                            />
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

export const EducationsPage = createResourcePage({
    stateKey: "educations",
    actions: educationsResource.actions,
    columns: eduCols,
    FormModal: EduModal,
    title: "Educations",
});

// ===== CERTIFICATIONS =====
const certCols = [
    { key: "title", label: "Title", render: (v) => <span className="font-medium text-sm">{v}</span> },
    { key: "issuingOrganization", label: "Issuer", render: (v) => <span className="text-xs">{v}</span> },
    { key: "credentialId", label: "Credential ID", render: (v) => <code className="text-xs">{v || "—"}</code> },
    {
        key: "issueDate",
        label: "Issued",
        render: (v) => (
            <span className="text-xs text-muted-foreground">{v ? format(new Date(v), "MMM yyyy") : "—"}</span>
        ),
    },
    {
        key: "doesNotExpire",
        label: "Expires",
        render: (v, row) => (
            <span className="text-xs">
                {v ? "Never" : row.expiryDate ? format(new Date(row.expiryDate), "MMM yyyy") : "—"}
            </span>
        ),
    },
];

function CertModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      title: item.title || "",
                      issuingOrganization: item.issuingOrganization || "",
                      credentialId: item.credentialId || "",
                      credentialUrl: item.credentialUrl || "",
                      issueDate: item.issueDate ? item.issueDate.slice(0, 10) : "",
                      expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "",
                      doesNotExpire: item.doesNotExpire || false,
                  }
                : { doesNotExpire: false },
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
                    <DialogTitle>{item ? "Edit Certification" : "New Certification"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Title *</Label>
                            <Input {...register("title", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Issuing Organization *</Label>
                            <Input {...register("issuingOrganization", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Credential ID</Label>
                            <Input {...register("credentialId")} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Credential URL</Label>
                            <Input {...register("credentialUrl")} placeholder="https://" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Issue Date *</Label>
                            <Input {...register("issueDate", { required: true })} type="date" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Expiry Date</Label>
                            <Input
                                {...register("expiryDate")}
                                type="date"
                                className="h-8 text-sm"
                                disabled={watch("doesNotExpire")}
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 col-span-2">
                            <Label className="text-xs">Does Not Expire</Label>
                            <Switch
                                checked={watch("doesNotExpire")}
                                onCheckedChange={(v) => setValue("doesNotExpire", v)}
                            />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Certificate File</Label>
                            <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setValue("certificate", e.target.files[0])}
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

export const CertificationsPage = createResourcePage({
    stateKey: "certifications",
    actions: certificationsResource.actions,
    columns: certCols,
    FormModal: CertModal,
    title: "Certifications",
});

// ===== ACHIEVEMENTS =====
const achCols = [
    { key: "title", label: "Title", render: (v) => <span className="font-medium text-sm">{v}</span> },
    { key: "awardedBy", label: "Awarded By", render: (v) => <span className="text-xs">{v || "—"}</span> },
    {
        key: "achievementType",
        label: "Type",
        render: (v) => (
            <Badge variant="outline" className="text-[10px] capitalize">
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
    {
        key: "awardDate",
        label: "Date",
        render: (v) => (
            <span className="text-xs text-muted-foreground">{v ? format(new Date(v), "MMM yyyy") : "—"}</span>
        ),
    },
];

function AchModal({ open, onClose, onSave, item, saving }) {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    useEffect(() => {
        reset(
            item
                ? {
                      title: item.title || "",
                      description: item.description || "",
                      awardedBy: item.awardedBy || "",
                      awardUrl: item.awardUrl || "",
                      achievementType: item.achievementType || "award",
                      awardDate: item.awardDate ? item.awardDate.slice(0, 10) : "",
                      isFeatured: item.isFeatured || false,
                      displayOrder: item.displayOrder || 0,
                  }
                : { achievementType: "award", isFeatured: false, displayOrder: 0 },
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
                    <DialogTitle>{item ? "Edit Achievement" : "New Achievement"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Title *</Label>
                            <Input {...register("title", { required: true })} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Awarded By</Label>
                            <Input {...register("awardedBy")} className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Type</Label>
                            <Select
                                defaultValue={watch("achievementType")}
                                onValueChange={(v) => setValue("achievementType", v)}
                            >
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {["award", "recognition", "competition", "publication", "other"].map((t) => (
                                        <SelectItem key={t} value={t} className="text-sm capitalize">
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Award Date</Label>
                            <Input {...register("awardDate")} type="date" className="h-8 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Award URL</Label>
                            <Input {...register("awardUrl")} placeholder="https://" className="h-8 text-sm" />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 col-span-2">
                            <Label className="text-xs">Featured</Label>
                            <Switch checked={watch("isFeatured")} onCheckedChange={(v) => setValue("isFeatured", v)} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label className="text-xs">Certificate</Label>
                            <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setValue("certificate", e.target.files[0])}
                                className="h-8 text-sm"
                            />
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

export const AchievementsPage = createResourcePage({
    stateKey: "achievements",
    actions: achievementsResource.actions,
    columns: achCols,
    FormModal: AchModal,
    title: "Achievements",
    extraActions: [{ label: "Toggle Featured", action: "toggle-featured", icon: Star }],
});
