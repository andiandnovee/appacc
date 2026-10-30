import { useCallback, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../../../api/axios";
import { Button } from "../../../components/ui/Button";
import Collapsible from "../../../components/ui/Collapsible";
import Drawer from "../../../components/ui/Drawer";
import Table from "../../../components/ui/Table";
import type { Column } from "../../../components/ui/Table";
import { useToast } from "../../../components/ui/Toast";
import { useAuth } from "../../../hooks/useAuth";
import GLAccountForm, { type GLAccount } from "./GLAccountForm";
import styles from "./GLAccountManagement.module.css";

interface TableHandle {
  refetch: () => void;
}

const PERMISSIONS = {
  view: "view gl accounts",
  create: "create gl accounts",
  edit: "edit gl accounts",
  delete: "delete gl accounts",
};

export default function GLAccountManagement() {
  const tableRef = useRef<TableHandle | null>(null);
  const { addToast } = useToast();
  const { user } = useAuth();
  const permissions: string[] = user?.permission_names ?? user?.permissions ?? [];
  const canView = permissions.includes(PERMISSIONS.view);
  const canCreate = permissions.includes(PERMISSIONS.create);
  const canEdit = permissions.includes(PERMISSIONS.edit);
  const canDelete = permissions.includes(PERMISSIONS.delete);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GLAccount | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(true);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditTarget(null);
  }, []);

  const handleSaved = useCallback(() => {
    addToast({ variant: "success", title: "GL Account berhasil disimpan." });
    tableRef.current?.refetch();
    closeDrawer();
  }, [addToast, closeDrawer]);

  const handleDelete = useCallback(
    async (account: GLAccount) => {
      const label = account.gl_acc || account.gl_text || `ID ${account.id}`;
      if (!confirm(`Hapus GL Account "${label}"?\nTindakan ini tidak dapat dibatalkan.`)) return;

      setDeletingId(account.id);
      try {
        await api.delete(`/gl-accounts/${account.id}`);
        addToast({ variant: "success", title: "GL Account berhasil dihapus." });
        tableRef.current?.refetch();
      } catch (error: any) {
        addToast({
          variant: "danger",
          title: error?.response?.data?.message || "Gagal menghapus GL Account.",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [addToast],
  );

  const columns = useMemo<Column[]>(() => {
    const result: Column[] = [
      {
        key: "gl_acc",
        label: "GL Account",
        sortable: true,
        cardRole: "title",
        render: (row: GLAccount) => <span className={styles.code}>{row.gl_acc || "—"}</span>,
        exportValue: (row: GLAccount) => row.gl_acc ?? "",
      },
      {
        key: "gl_text",
        label: "Nama GL",
        sortable: true,
        cardRole: "subtitle",
        render: (row: GLAccount) => <span className={styles.muted}>{row.gl_text || "—"}</span>,
        exportValue: (row: GLAccount) => row.gl_text ?? "",
      },
      {
        key: "gl_group",
        label: "Group GL",
        sortable: true,
        collapsible: true,
        collapseOrder: 0,
        render: (row: GLAccount) => <span className={styles.muted}>{row.gl_group || "—"}</span>,
        exportValue: (row: GLAccount) => row.gl_group ?? "",
      },
      {
        key: "group_src",
        label: "Sumber",
        sortable: true,
        cardRole: "badge",
        render: (row: GLAccount) => <span className={styles.source}>{row.group_src}</span>,
        exportValue: (row: GLAccount) => row.group_src,
      },
      {
        key: "desc",
        label: "Keterangan",
        sortable: true,
        collapsible: true,
        collapseOrder: 1,
        render: (row: GLAccount) => <span className={styles.muted}>{row.desc || "—"}</span>,
        exportValue: (row: GLAccount) => row.desc ?? "",
      },
      {
        key: "other_desc",
        label: "Keterangan Tambahan",
        sortable: true,
        collapsible: true,
        collapseOrder: 2,
        render: (row: GLAccount) => <span className={styles.muted}>{row.other_desc || "—"}</span>,
        exportValue: (row: GLAccount) => row.other_desc ?? "",
      },
    ];

    if (canEdit || canDelete) {
      result.push({
        key: "actions",
        label: "Aksi",
        sortable: false,
        exportable: false,
        render: (row: GLAccount) => (
          <div className={styles.actions}>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditTarget(row);
                  setDrawerOpen(true);
                }}
              >
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                variant="danger"
                size="sm"
                iconLeft={<Trash2 size={13} />}
                onClick={() => handleDelete(row)}
                disabled={deletingId === row.id}
              >
                Hapus
              </Button>
            )}
          </div>
        ),
      });
    }
    return result;
  }, [canDelete, canEdit, deletingId, handleDelete]);

  if (!canView) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Manajemen GL Account</h1>
        <p className={styles.pageSubtitle}>Anda belum memiliki izin untuk melihat master GL Account.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manajemen GL Account</h1>
          <p className={styles.pageSubtitle}>Master akun GL untuk referensi jurnal dan proses akuntansi.</p>
        </div>
      </div>

      {canCreate && (
        <Collapsible
          title="Tambah GL Account Baru"
          subtitle="Isi kode dan keterangan akun"
          defaultOpen
          open={addOpen}
          onToggle={setAddOpen}
        >
          <GLAccountForm
            account={null}
            onCancel={() => setAddOpen(false)}
            onSaved={() => {
              addToast({ variant: "success", title: "GL Account berhasil ditambahkan." });
              tableRef.current?.refetch();
            }}
          />
        </Collapsible>
      )}

      <Drawer isOpen={drawerOpen} onClose={closeDrawer} size="lg">
        <Drawer.Header
          title="Edit GL Account"
          subtitle={`${editTarget?.gl_acc || "Tanpa kode"} · ${editTarget?.gl_text || ""}`}
          onClose={closeDrawer}
        />
        <Drawer.Body>
          <GLAccountForm account={editTarget} onCancel={closeDrawer} onSaved={handleSaved} />
        </Drawer.Body>
      </Drawer>

      <Collapsible title="Daftar GL Account" defaultOpen>
        <Table
          ref={tableRef}
          url="/gl-accounts"
          columns={columns}
          dataKey="data"
          pageSize={15}
          exportName="gl_accounts_export"
          title=""
          searchable
          selectable={false}
          serverSide
          serverSideFiltering
          tableId="gl-accounts"
        />
      </Collapsible>
    </div>
  );
}
