/** @format */

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../components/tables/DataTable";
import ConfirmDialog from "../components/ui/confirm-dialog";

export function createResourcePage({
    stateKey,
    actions,
    columns,
    FormModal,
    title,
    searchPlaceholder,
    extraActions = [],
}) {
    return function ResourcePage() {
        const dispatch = useDispatch();
        const { items, loading, saving, pagination, error } = useSelector((s) => s[stateKey]);
        const [page, setPage] = useState(1);
        const [search, setSearch] = useState("");
        const [modalOpen, setModalOpen] = useState(false);
        const [editItem, setEditItem] = useState(null);
        const [deleteItem, setDeleteItem] = useState(null);
        const [deleting, setDeleting] = useState(false);

        const load = useCallback(
            (p = page, s = search) => {
                dispatch(actions.fetchAll({ page: p, limit: 20, ...(s ? { search: s } : {}) }));
            },
            [dispatch, page, search],
        );

        useEffect(() => {
            load();
        }, [page]);

        const handleSearch = useCallback(
            (val) => {
                setSearch(val);
                setPage(1);
                dispatch(actions.fetchAll({ page: 1, limit: 20, ...(val ? { search: val } : {}) }));
            },
            [dispatch],
        );

        const handleCreate = () => {
            setEditItem(null);
            setModalOpen(true);
        };
        const handleEdit = (item) => {
            setEditItem(item);
            setModalOpen(true);
        };

        const handleDelete = async () => {
            if (!deleteItem) return;
            setDeleting(true);
            try {
                await dispatch(actions.deleteOne(deleteItem._id)).unwrap();
                toast.success("Deleted successfully");
                setDeleteItem(null);
                load();
            } catch (e) {
                toast.error(e || "Failed to delete");
            } finally {
                setDeleting(false);
            }
        };

        const handleSave = async (data) => {
            try {
                if (editItem) {
                    await dispatch(actions.updateOne({ id: editItem._id, data })).unwrap();
                    toast.success("Updated successfully");
                } else {
                    await dispatch(actions.createOne(data)).unwrap();
                    toast.success("Created successfully");
                }
                setModalOpen(false);
                setEditItem(null);
                load();
            } catch (e) {
                toast.error(e || "Failed to save");
                throw e;
            }
        };

        const handlePatch = async (item, action) => {
            try {
                await dispatch(actions.patchOne({ id: item._id, action })).unwrap();
                toast.success("Updated successfully");
                load();
            } catch (e) {
                toast.error(e || "Failed");
            }
        };

        const resolvedExtraActions = extraActions.map((ea) => ({
            ...ea,
            onClick: (row) => (ea.action ? handlePatch(row, ea.action) : ea.onClick?.(row)),
        }));

        return (
            <div>
                <DataTable
                    title={title}
                    data={items}
                    columns={columns}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={setPage}
                    onSearch={handleSearch}
                    onRefresh={() => load()}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={(item) => setDeleteItem(item)}
                    extraActions={resolvedExtraActions}
                    searchPlaceholder={searchPlaceholder || `Search ${title}...`}
                    createLabel={`New ${title?.replace(/s$/, "") || "Item"}`}
                />
                {FormModal && (
                    <FormModal
                        open={modalOpen}
                        onClose={() => {
                            setModalOpen(false);
                            setEditItem(null);
                        }}
                        onSave={handleSave}
                        item={editItem}
                        saving={saving}
                    />
                )}
                <ConfirmDialog
                    open={!!deleteItem}
                    onClose={() => setDeleteItem(null)}
                    onConfirm={handleDelete}
                    loading={deleting}
                    title="Delete"
                    description="Are you sure you want to delete this item? This action cannot be undone."
                />
            </div>
        );
    };
}
