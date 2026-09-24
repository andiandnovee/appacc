import { useCallback, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import apiClient from "../../../api/axios";
import { SplitButton } from "../../../components/ui/Button";
import Collapsible from "../../../components/ui/Collapsible";
import Drawer from "../../../components/ui/Drawer";
import Table from "../../../components/ui/Table";
import type { Column } from "../../../components/ui/Table";
import { useToast } from "../../../components/ui/Toast";
import CustomerForm from "./CustomerForm";
import styles from "./CustomerManagement.module.css";

interface TableHandle {
  refetch: () => void;
}

interface Customer {
  id: number;
  sap_id: string | null;
  name: string | null;
  short_name: string | null;
}

export default function CustomerManagement() {
  const tableRef = useRef<TableHandle | null>(null);
  const { addToast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(true);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditTarget(null);
  }, []);

  const handleDelete = useCallback(
    async (customer: Customer) => {
      const label = customer.sap_id || customer.name || `ID ${customer.id}`;
      if (!confirm(`Hapus Customer "${label}"?\nTindakan ini tidak dapat dibatalkan.`)) {
        return;
      }

      setDeletingId(customer.id);
      try {
        await apiClient.delete(`/customers/${customer.id}`);
        addToast({ variant: "success", title: "Customer berhasil dihapus." });
        tableRef.current?.refetch();
      } catch (error: any) {
        addToast({
          variant: "danger",
          title: error?.response?.data?.message || "Gagal menghapus customer.",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [addToast],
  );

  const columns = useMemo<Column[]>(
    () => [
      {
        key: "sap_id",
        label: "SAP ID",
        sortable: true,
        cardRole: "title",
        render: (row: Customer) => (
          <span className={styles.code}>{row.sap_id || "—"}</span>
        ),
        exportValue: (row: Customer) => row.sap_id ?? "",
      },
      {
        key: "short_name",
        label: "Nama Singkat",
        sortable: true,
        cardRole: "badge",
        render: (row: Customer) => (
          <span className={styles.muted}>{row.short_name || "—"}</span>
        ),
        exportValue: (row: Customer) => row.short_name ?? "",
      },
      {
        key: "name",
        label: "Nama Customer",
        sortable: true,
        collapsible: true,
        collapseOrder: 0,
        cardRole: "subtitle",
        render: (row: Customer) => (
          <span className={styles.muted}>{row.name || "—"}</span>
        ),
        exportValue: (row: Customer) => row.name ?? "",
      },
      {
        key: "actions",
        label: "Aksi",
        sortable: false,
        exportable: false,
        render: (row: Customer) => (
          <SplitButton
            label="Edit"
            variant="outline"
            size="sm"
            onClick={() => {
              setEditTarget(row);
              setDrawerOpen(true);
            }}
            options={[
              {
                label: "Hapus",
                icon: <Trash2 size={13} />,
                onClick: () => handleDelete(row),
              },
            ]}
            disabled={deletingId === row.id}
          />
        ),
      },
    ],
    [deletingId, handleDelete],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manajemen Customer</h1>
          <p className={styles.pageSubtitle}>Data customer dari SAP</p>
        </div>
      </div>

      <Collapsible
        title="Tambah Customer Baru"
        subtitle="Isi data customer"
        defaultOpen={true}
        open={addOpen}
        onToggle={setAddOpen}
      >
        <CustomerForm
          customer={null}
          onCancel={() => setAddOpen(false)}
          onSaved={() => {
            addToast({ variant: "success", title: "Customer berhasil ditambahkan." });
            tableRef.current?.refetch();
          }}
        />
      </Collapsible>

      <Drawer isOpen={drawerOpen} onClose={closeDrawer} size="md">
        <Drawer.Header
          title="Edit Customer"
          subtitle={`SAP ID: ${editTarget?.sap_id ?? "—"}`}
          onClose={closeDrawer}
        />
        <Drawer.Body>
          <CustomerForm
            customer={editTarget}
            onCancel={closeDrawer}
            onSaved={() => {
              addToast({ variant: "success", title: "Customer berhasil disimpan." });
              tableRef.current?.refetch();
              closeDrawer();
            }}
          />
        </Drawer.Body>
      </Drawer>

      <Collapsible title="Daftar Customer" defaultOpen={true}>
        <Table
          ref={tableRef}
          url="/customers"
          columns={columns}
          dataKey="data"
          pageSize={15}
          exportName="customers_export"
          title=""
          searchable={true}
          selectable={false}
          serverSide={true}
          serverSideFiltering={true}
          tableId="customers"
        />
      </Collapsible>
    </div>
  );
}
