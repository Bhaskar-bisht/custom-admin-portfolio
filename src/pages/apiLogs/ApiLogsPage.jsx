/** @format */

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchApiLogs,
    fetchApiLogStats,
    fetchApiLogById,
    deleteApiLog,
    deleteAllApiLogs,
} from "../../store/slices/extraSlices";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Skeleton } from "../../components/ui/misc";
import ConfirmDialog from "../../components/ui/confirm-dialog";
import { Search, RefreshCw, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

const methodColors = {
    GET: "info",
    POST: "success",
    PUT: "warning",
    PATCH: "warning",
    DELETE: "destructive",
    OPTIONS: "secondary",
};

const statusColor = (code) => {
    if (code < 300) return "success";
    if (code < 400) return "info";
    if (code < 500) return "warning";
    return "destructive";
};

function JsonViewer({ data, depth = 0 }) {
    if (data === null || data === undefined) return <span className="text-gray-400">null</span>;
    if (typeof data === "boolean") return <span className="text-purple-400">{String(data)}</span>;
    if (typeof data === "number") return <span className="text-blue-400">{data}</span>;
    if (typeof data === "string") return <span className="text-green-400">"{data}"</span>;
    if (Array.isArray(data)) {
        if (data.length === 0) return <span className="text-gray-400">[]</span>;
        return (
            <span>
                {"["}
                <div className="ml-4">
                    {data.map((item, i) => (
                        <div key={i}>
                            <JsonViewer data={item} depth={depth + 1} />
                            {i < data.length - 1 ? "," : ""}
                        </div>
                    ))}
                </div>
                {"]"}
            </span>
        );
    }
    const entries = Object.entries(data);
    if (entries.length === 0) return <span className="text-gray-400">{"{}"}</span>;
    return (
        <span>
            {"{"}
            <div className="ml-4">
                {entries.map(([k, v], i) => (
                    <div key={k}>
                        <span className="text-yellow-300">"{k}"</span>
                        <span className="text-gray-400">: </span>
                        <JsonViewer data={v} depth={depth + 1} />
                        {i < entries.length - 1 ? "," : ""}
                    </div>
                ))}
            </div>
            {"}"}
        </span>
    );
}

function LogDetailModal({ open, onClose, logId }) {
    const dispatch = useDispatch();
    const { current, loading } = useSelector((s) => s.apiLogs);

    useEffect(() => {
        if (open && logId) dispatch(fetchApiLogById(logId));
    }, [open, logId]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-sm">
                        {current && (
                            <>
                                <Badge variant={methodColors[current.method]} className="text-[10px]">
                                    {current.method}
                                </Badge>
                                <code className="text-xs">{current.path}</code>
                                <Badge variant={statusColor(current.statusCode)} className="text-[10px]">
                                    {current.statusCode}
                                </Badge>
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>
                {loading || !current ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : (
                    <div className="space-y-4 overflow-y-auto max-h-[65vh] text-xs">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                ["Full URL", current.fullUrl],
                                ["IP Address", current.ipAddress],
                                ["Response Time", `${current.responseTime}ms`],
                                [
                                    "Timestamp",
                                    current.timestamp
                                        ? format(new Date(current.timestamp), "MMM d, yyyy HH:mm:ss")
                                        : "—",
                                ],
                                ["Origin", current.origin || "—"],
                                ["User Agent", current.userAgent || "—"],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-lg bg-muted p-2">
                                    <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
                                    <p className="font-mono text-xs break-all">{value}</p>
                                </div>
                            ))}
                        </div>
                        {[
                            { label: "Request Query", data: current.requestQuery },
                            { label: "Request Body", data: current.requestBody },
                            { label: "Response Body", data: current.responseBody },
                            { label: "Request Headers", data: current.requestHeaders },
                        ]
                            .filter(({ data }) => data && Object.keys(data).length > 0)
                            .map(({ label, data }) => (
                                <div key={label}>
                                    <p className="text-[10px] font-medium text-muted-foreground mb-1">{label}</p>
                                    <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto font-mono leading-relaxed">
                                        <JsonViewer data={data} />
                                    </pre>
                                </div>
                            ))}
                        {current.errorMessage && (
                            <div>
                                <p className="text-[10px] font-medium text-destructive mb-1">Error</p>
                                <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-xs font-mono">
                                    {current.errorMessage}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default function ApiLogsPage() {
    const dispatch = useDispatch();
    const { items, stats, pagination, loading } = useSelector((s) => s.apiLogs);
    const [page, setPage] = useState(1);
    const [method, setMethod] = useState("");
    const [status, setStatus] = useState("");
    const [path, setPath] = useState("");
    const [viewId, setViewId] = useState(null);
    const [confirmClear, setConfirmClear] = useState(false);

    const load = useCallback(
        (p = 1) => {
            dispatch(
                fetchApiLogs({
                    page: p,
                    limit: 50,
                    ...(method ? { method } : {}),
                    ...(status ? { statusCode: status } : {}),
                    ...(path ? { path } : {}),
                }),
            );
        },
        [dispatch, method, status, path],
    );

    useEffect(() => {
        load();
        dispatch(fetchApiLogStats());
    }, []);

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteApiLog(id)).unwrap();
            toast.success("Log deleted");
        } catch {
            toast.error("Failed to delete");
        }
    };

    const handleClearAll = async () => {
        try {
            await dispatch(deleteAllApiLogs()).unwrap();
            toast.success("All logs cleared");
            setConfirmClear(false);
        } catch {
            toast.error("Failed to clear");
        }
    };

    return (
        <div className="space-y-4">
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: "Total Requests", value: stats.totalRequests?.toLocaleString() },
                        { label: "Avg Response", value: `${Math.round(stats.averageResponseTime || 0)}ms` },
                        { label: "Error Rate", value: `${stats.errorRate || 0}%` },
                        {
                            label: "Top Methods",
                            value:
                                stats.methodBreakdown
                                    ?.slice(0, 2)
                                    .map((m) => `${m._id}: ${m.count}`)
                                    .join(", ") || "—",
                        },
                    ].map(({ label, value }) => (
                        <Card key={label}>
                            <CardContent className="p-4">
                                <p className="text-[10px] text-muted-foreground">{label}</p>
                                <p className="font-semibold mt-0.5 text-sm">{value || "—"}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap gap-2 items-center">
                <div className="relative flex-1 min-w-[150px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Filter by path..."
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        className="pl-8 h-8 text-sm"
                    />
                </div>
                <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="h-8 text-xs px-2 rounded-md border border-input bg-transparent"
                >
                    <option value="">All Methods</option>
                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-8 text-xs px-2 rounded-md border border-input bg-transparent"
                >
                    <option value="">All Status</option>
                    {["200", "201", "400", "401", "403", "404", "500"].map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => load(1)}>
                    <RefreshCw className="w-3 h-3" /> Refresh
                </Button>
                <Button variant="destructive" size="sm" className="h-8 gap-1" onClick={() => setConfirmClear(true)}>
                    <Trash2 className="w-3 h-3" /> Clear All
                </Button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-xs">Method</TableHead>
                            <TableHead className="text-xs">Path</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs">Time</TableHead>
                            <TableHead className="text-xs">IP</TableHead>
                            <TableHead className="text-xs">Timestamp</TableHead>
                            <TableHead className="text-xs w-16 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array(7)
                                        .fill(0)
                                        .map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-3 w-16" />
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-xs text-muted-foreground">
                                    No logs found
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((log) => (
                                <TableRow
                                    key={log._id}
                                    className="cursor-pointer text-xs"
                                    onClick={() => setViewId(log._id)}
                                >
                                    <TableCell>
                                        <Badge
                                            variant={methodColors[log.method] || "secondary"}
                                            className="text-[10px] font-mono"
                                        >
                                            {log.method}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs truncate max-w-[250px] block">{log.path}</code>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusColor(log.statusCode)} className="text-[10px]">
                                            {log.statusCode}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`text-xs font-mono ${log.responseTime > 1000 ? "text-destructive" : log.responseTime > 500 ? "text-yellow-500" : "text-muted-foreground"}`}
                                        >
                                            {log.responseTime}ms
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-muted-foreground font-mono">{log.ipAddress}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-muted-foreground">
                                            {log.timestamp ? format(new Date(log.timestamp), "MMM d HH:mm:ss") : "—"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => setViewId(log._id)}
                                            >
                                                <Eye className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-destructive"
                                                onClick={() => handleDelete(log._id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{pagination.total} total logs</span>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={page <= 1}
                            onClick={() => {
                                setPage((p) => p - 1);
                                load(page - 1);
                            }}
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                        <span className="px-2 py-1">
                            {page}/{pagination.pages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={page >= pagination.pages}
                            onClick={() => {
                                setPage((p) => p + 1);
                                load(page + 1);
                            }}
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            )}

            <LogDetailModal open={!!viewId} onClose={() => setViewId(null)} logId={viewId} />
            <ConfirmDialog
                open={confirmClear}
                onClose={() => setConfirmClear(false)}
                onConfirm={handleClearAll}
                title="Clear All Logs"
                description="This will permanently delete all API logs. Cannot be undone."
            />
        </div>
    );
}
