/** @format */

import { ChevronLeft, ChevronRight, Edit2, MoreHorizontal, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/misc";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function DataTable({
    title,
    data = [],
    columns = [],
    loading = false,
    pagination = null,
    onPageChange,
    onSearch,
    onRefresh,
    onCreate,
    onEdit,
    onDelete,
    extraActions = [],
    searchPlaceholder = "Search...",
    createLabel = "Create",
}) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        onSearch?.(val);
    };

    return (
        <div className="space-y-4">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={handleSearch}
                            className="pl-8 h-8 text-sm"
                        />
                    </div>
                    {onRefresh && (
                        <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={onRefresh}>
                            <RefreshCw className="w-3.5 h-3.5" />
                        </Button>
                    )}
                </div>
                {onCreate && (
                    <Button size="sm" onClick={onCreate} className="h-8 gap-1.5 shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                        {createLabel}
                    </Button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columns.map((col) => (
                                <TableHead key={col.key} className={cn("text-xs", col.className)}>
                                    {col.label}
                                </TableHead>
                            ))}
                            {(onEdit || onDelete || extraActions.length > 0) && (
                                <TableHead className="text-xs w-12 text-right">Actions</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            <Skeleton className="h-4 w-full max-w-[120px]" />
                                        </TableCell>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <TableCell>
                                            <Skeleton className="h-4 w-8 ml-auto" />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="text-center py-12 text-muted-foreground text-sm"
                                >
                                    No records found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, i) => (
                                <TableRow key={row._id || i} className="cursor-pointer" onClick={() => onEdit?.(row)}>
                                    {columns.map((col) => (
                                        <TableCell key={col.key} className={cn("text-sm py-3", col.cellClassName)}>
                                            {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                                        </TableCell>
                                    ))}
                                    {(onEdit || onDelete || extraActions.length > 0) && (
                                        <TableCell className="text-right py-3" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    {onEdit && (
                                                        <DropdownMenuItem onClick={() => onEdit(row)}>
                                                            <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                    )}
                                                    {extraActions.map((action) => (
                                                        <DropdownMenuItem
                                                            key={action.label}
                                                            onClick={() => action.onClick(row)}
                                                        >
                                                            {action.icon && (
                                                                <action.icon className="w-3.5 h-3.5 mr-2" />
                                                            )}
                                                            {action.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    {onDelete && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => onDelete(row)}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Showing {(pagination.page - 1) * pagination.limit + 1}–
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={pagination.page <= 1}
                            onClick={() => onPageChange?.(pagination.page - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="px-2 text-xs">
                            {pagination.page} / {pagination.pages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => onPageChange?.(pagination.page + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
