import { useState, useCallback, useRef, useMemo } from "react";
import VendorFormModal from "./VendorFormModal";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Toggle from "../../../components/ui/Toggle";
import Table from "../../../components/ui/Table";
import { useToast } from "../../../components/ui/Toast";
import { Building2, Plus, Pencil, Archive } from "lucide-react";
import styles from "./VendorManagement.module.css";

const api = (path, options = {}) => {
  const token = localStorage.getItem("appacc_token") ?? sessionStorage.getItem("appacc_token");
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  return fetch(`${apiBase}${path}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    ...options,
  }).then((r) => r.json().then((json) => { if (!r.ok) throw new Error(json.message); return json; }));
};

const SERVICE_TYPES = [
  { value: "", label: "— Pilih Jenis Layanan —" },
  { value: "HF9", label: "HF9 - Barang/Jasa Umum" },
  { value: "HT4", label: "HT4 - Layanan Khusus" },
  { value: "OTHER", label: "Lainnya" },
];

const TRASH_FILTERS = [
  { value: "without_trash", label: "📋 Data Aktif" },
  { value: "with_trash", label: "📁 Semua Data" },
  { value: "only_trash", label: "🗑️ Data Nonaktif" },
];

const serviceLabel = (val) => SERVICE_TYPES.find(t => t.value === val)?.label ?? val ?? "—";

export default function VendorManagement() {
  const [formTarget, setFormTarget] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [trashFilter, setTrashFilter] = useState("without_trash");
  const tableRef = useRef(null);
  const { addToast } = useToast();

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const fullUrl = useMemo(() => `${apiBase}/vendors`, [apiBase]);

  const handleStatusToggle = useCallback(async (vendor, isActive, refetch) => {
    setUpdatingStatus(vendor.id);
    try {
      if (!isActive) await api(`/vendors/${vendor.id}`, { method: "DELETE" });
      else await api(`/vendors/${vendor.id}/restore`, { method: "POST" });
      addToast({ variant: "success", title: `Vendor "${vendor.name}" ${isActive ? 'diaktifkan' : 'dinonaktifkan'}.` });
      refetch();
    } catch (err) {
      addToast({ variant: "danger", title: "Gagal mengubah status vendor." });
    } finally {
      setUpdatingStatus(null);
    }
  }, [addToast]);

  const handleForceDelete = useCallback(async (vendor, refetch) => {
    if (!confirm(`Hapus permanen "${vendor.name}"?`)) return;
    try {
      await api(`/vendors/${vendor.id}/force-delete`, { method: "DELETE" });
      addToast({ variant: "success", title: `Vendor "${vendor.name}" dihapus permanen.` });
      refetch();
    } catch (err) {
      addToast({ variant: "danger", title: "Gagal menghapus vendor permanen." });
    }
  }, [addToast]);

  const handleSaved = useCallback(() => {
    setFormTarget(null);
    addToast({ variant: "success", title: "Data vendor berhasil disimpan." });
    tableRef.current?.refetch();
  }, [addToast]);

  const columns = useMemo(() => [
    { key: "sap_id", label: "SAP ID", sortable: true, render: (row) => <span className={styles.vendorCode}>{row.sap_id || "—"}</span> },
    { key: "name", label: "Nama Vendor", sortable: true, render: (row) => (
      <div><div className={styles.vendorName}><Building2 size={14} />{row.name}</div>{row.address && <p className={styles.vendorAddress}>{row.address}</p>}</div>
    ) },
    { key: "npwp", label: "NPWP", sortable: true, render: (row) => <span className={styles.muted}>{row.npwp || "—"}</span> },
    { key: "service_type", label: "Jenis Layanan", sortable: true, render: (row) => <span className={styles.muted}>{serviceLabel(row.service_type)}</span> },
    { key: "pph_type", label: "PPh", sortable: false, render: (row) => <span className={styles.muted}>{row.pph_type ? `${row.pph_type}% (${row.pph_rate}%)` : "—"}</span> },
    { key: "status", label: "Status", sortable: false, render: (row) => (
      <div className={styles.statusCell}>
        <Toggle value={row.deleted_at === null} onChange={(e) => handleStatusToggle(row, e.target.checked, tableRef.current?.refetch)} disabled={updatingStatus === row.id} size="sm" variant={row.deleted_at === null ? "success" : "danger"} label={row.deleted_at === null ? "Aktif" : "Tidak Aktif"} />
      </div>
    ) },
    { key: "actions", label: "Aksi", sortable: false, render: (row) => (
      <div className={styles.actions}>
        <Button variant="outline" size="sm" iconLeft={<Pencil size={13} />} onClick={() => setFormTarget(row)} disabled={row.deleted_at !== null}>Edit</Button>
        {row.deleted_at !== null && <Button variant="outline" size="sm" iconLeft={<Archive size={13} />} onClick={() => handleForceDelete(row, tableRef.current?.refetch)}>Hapus Permanen</Button>}
      </div>
    ) },
  ], [handleStatusToggle, handleForceDelete, updatingStatus]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div><h1 className={styles.pageTitle}>Manajemen Vendor</h1><p className={styles.pageSubtitle}>Kelola data vendor dan rekanan perusahaan</p></div>
        <div className={styles.filterWrapper}><Select value={trashFilter} onChange={(e) => setTrashFilter(e.target.value)} options={TRASH_FILTERS} size="sm" /></div>
        <Button iconLeft={<Plus size={14} />} onClick={() => setFormTarget({})}>Tambah Vendor</Button>
      </div>
      <Table ref={tableRef} url={fullUrl} columns={columns} dataKey="data" pageSize={15} exportName="vendors_export" title="Daftar Vendor" searchable={true} selectable={false} defaultParams={{ trash_filter: trashFilter }} serverSide={true} />
      {formTarget !== null && <VendorFormModal vendor={formTarget.id ? formTarget : null} onClose={() => setFormTarget(null)} onSaved={handleSaved} api={api} />}
    </div>
  );
}