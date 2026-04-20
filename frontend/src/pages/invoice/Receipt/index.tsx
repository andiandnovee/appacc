import { FC, ReactNode, ReactElement, useState, useCallback, useRef, useMemo } from 'react';
import ReceiptFormModal from "./ReceiptFormModal";
import Button from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import { useToast } from "../../../components/ui/Toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./ReceiptManagement.module.css";

interface InvoiceReceiptManagementProps {
  // Props here
}


const api = (path, options = {}) => {
  const token =
    localStorage.getItem("appacc_token") ??
    sessionStorage.getItem("appacc_token");
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  return fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  }).then((r) =>
    r.json().then((json) => {
      if (!r.ok) throw new Error(json.message);
      return json;
    }),
  );
};

export default function InvoiceReceiptManagement() {
  const [formTarget, setFormTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const tableRef = useRef(null);
  const { addToast } = useToast();
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
 
  const fullUrl = useMemo(() => `${apiBase}/receipts`, [apiBase]);

  const handleDelete = useCallback(
    async (receipt, refetch) => {
      if (
        !confirm(
          `Hapus invoice receipt "${receipt.invoice_number || receipt.po_number || `ID ${receipt.id}`}"? Tindakan ini tidak dapat dibatalkan.`,
        )
      )
        return;
      setDeletingId(receipt.id);
      try {
        await api(`/receipts/${receipt.id}`, { method: "DELETE" });
        addToast({
          variant: "success",
          title: "Invoce receipt berhasil dihapus.",
        });
        refetch();
      } catch (err) {
        addToast({
          variant: "danger",
          title: "Gagal menghapus invoice receipt.",
        });
      } finally {
        setDeletingId(null);
      }
    },
    [addToast],
  );

  const handleSaved = useCallback(() => {
    setFormTarget(null);
    addToast({
      variant: "success",
      title: "Data invoice receipt berhasil disimpan.",
    });
    tableRef.current?.refetch();
  }, [addToast]);

  const columns = useMemo(
    () => [
      {
        key: "po_number",
        label: "PO Number",
        sortable: true,
        //filterable: true,
        //filtertype: "text",
        render: (row) => (
          <span className={styles.code}>{row.po_number || "—"}</span>
        ),
      },
      {
        key: "invoice_number",
        label: "Invoice Number",
        sortable: true,
        //filterable: true,
        //filtertype: "text",
        render: (row) => (
          <span className={styles.code}>{row.invoice_number || "—"}</span>
        ),
      },
      {
        key: "receipt_date",
        label: "Tanggal Receipt",
        sortable: true,
        render: (row) => (
          <span className={styles.muted}>
            {row.receipt_date
              ? new Date(row.receipt_date).toLocaleDateString("id-ID")
              : "—"}
          </span>
        ),
      },
      {
        key: "vendor",
        label: "Vendor",
        sortable: false,
//filterable: true,
  //      filtertype: "text",
        render: (row) => (
          <span className={styles.muted}>{row.vendor?.name || "—"}</span>
        ),
      },
      {   
        key: "company",
        label: "Perusahaan",
        sortable: false,
    //    filterable: true,
      //  filtertype: "select",
        render: (row) => (
          <span className={styles.muted}>{row.company?.name || "—"}</span>
        ),
      },
      {
        key: "stage",
        label: "Stage",
        sortable: false,
        render: (row) => (
          <span className={styles.muted}>{row.stage?.name || "—"}</span>
        ),
      },
      {
        key: "amount",
        label: "Jumlah",
        sortable: true,
        render: (row) => (
          <span className={styles.muted}>
            {row.amount
              ? `Rp ${parseFloat(row.amount).toLocaleString("id-ID")}`
              : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Aksi",
        sortable: false,
        render: (row) => (
          <div className={styles.actions}>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Pencil size={13} />}
              onClick={() => {
               // console.log("Edit clicked", row);
                setFormTarget(row);
              }}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Trash2 size={13} />}
              onClick={() => {
 // console.log("Delete clicked", row);
  handleDelete(row, tableRef.current?.refetch);
}}
              disabled={deletingId === row.id}
              className={styles.deleteBtn}
            >
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete, deletingId],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manajemen Invoice Receipt</h1>
          <p className={styles.pageSubtitle}>
            Kelola data invoice receipt perusahaan
          </p>
        </div>
        <Button iconLeft={<Plus size={14} />} onClick={() => setFormTarget({})}>
          Tambah Receipt
        </Button>
      </div>
      <Table
        ref={tableRef}
        url={fullUrl}
        columns={columns}
        dataKey="data"
        pageSize={15}
        exportName="invoice_receipts_export"
        title="Daftar Invoice Receipt"
        searchable={true}
        selectable={false}
        serverSide={true}
      />
      {formTarget !== null && (
        <ReceiptFormModal
          receipt={formTarget.id ? formTarget : null}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
          api={api}
        />
      )}
    </div>
  );
}
