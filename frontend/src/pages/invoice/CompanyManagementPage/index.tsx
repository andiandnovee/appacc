import { useCallback, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import apiClient from "../../../api/axios";
import { SplitButton } from "../../../components/ui/Button";
import Collapsible from "../../../components/ui/Collapsible";
import Drawer from "../../../components/ui/Drawer";
import Table from "../../../components/ui/Table";
import type { Column } from "../../../components/ui/Table";
import { useToast } from "../../../components/ui/Toast";
import CompanyForm from "./CompanyForm";
import styles from "./CompanyManagement.module.css";

interface TableHandle { refetch: () => void }
interface Company {
  id: number;
  sap_id: number | null;
  name: string;
  npwp: string | null;
  address: string | null;
  accbank: string | null;
}

export default function CompanyManagement() {
  const tableRef = useRef<TableHandle | null>(null);
  const { addToast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Company | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(true);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditTarget(null);
  }, []);

  const handleDelete = useCallback(async (company: Company) => {
    const label = company.name || `ID ${company.id}`;
    if (!confirm(`Hapus Company "${label}"? Data yang masih dipakai Business Area atau Invoice Receipt tidak dapat dihapus.`)) return;
    setDeletingId(company.id);
    try {
      await apiClient.delete(`/companies/${company.id}`);
      addToast({ variant: "success", title: "Company berhasil dihapus." });
      tableRef.current?.refetch();
    } catch (error: any) {
      addToast({ variant: "danger", title: error?.response?.data?.message || "Gagal menghapus Company." });
    } finally {
      setDeletingId(null);
    }
  }, [addToast]);

  const columns = useMemo<Column[]>(() => [
    { key: "sap_id", label: "SAP ID", sortable: true, cardRole: "badge", render: (row: Company) => <span className={styles.code}>{row.sap_id ?? "—"}</span>, exportValue: (row: Company) => row.sap_id ?? "" },
    { key: "name", label: "Nama Company", sortable: true, cardRole: "title", render: (row: Company) => <span className={styles.name}>{row.name || "—"}</span>, exportValue: (row: Company) => row.name },
    { key: "npwp", label: "NPWP", sortable: true, cardRole: "subtitle", render: (row: Company) => <span className={styles.muted}>{row.npwp || "—"}</span>, exportValue: (row: Company) => row.npwp ?? "" },
    { key: "address", label: "Alamat", sortable: true, collapsible: true, collapseOrder: 0, render: (row: Company) => <span className={styles.muted}>{row.address || "—"}</span>, exportValue: (row: Company) => row.address ?? "" },
    { key: "accbank", label: "Rekening Bank", sortable: true, collapsible: true, collapseOrder: 1, render: (row: Company) => <span className={styles.muted}>{row.accbank || "—"}</span>, exportValue: (row: Company) => row.accbank ?? "" },
    { key: "actions", label: "Aksi", sortable: false, exportable: false, render: (row: Company) => <SplitButton label="Edit" variant="outline" size="sm" onClick={() => { setEditTarget(row); setDrawerOpen(true); }} options={[{ label: "Hapus", icon: <Trash2 size={13} />, onClick: () => void handleDelete(row) }]} disabled={deletingId === row.id} /> },
  ], [deletingId, handleDelete]);

  const saved = (message: string) => {
    addToast({ variant: "success", title: message });
    tableRef.current?.refetch();
  };

  return <div className={styles.page}>
    <header className={styles.pageHeader}>
      <div><p className={styles.eyebrow}>DATABASE MASTER</p><h1 className={styles.pageTitle}>Companies</h1><p className={styles.pageSubtitle}>Kelola data identitas perusahaan yang dipakai di modul APPACC.</p></div>
      <div className={styles.headerMeta}><span className={styles.metaDot} /> Data perusahaan</div>
    </header>
    <section className={styles.overview} aria-label="Informasi pengelolaan company">
      <div className={styles.overviewMark}>C</div><div><strong>Company master</strong><p>Gunakan SAP ID dan nama legal yang sesuai dengan data referensi SAP.</p></div><span className={styles.overviewHint}>Referensi aktif</span>
    </section>
    <Collapsible title="Tambah Company Baru" subtitle="Lengkapi identitas perusahaan" defaultOpen open={addOpen} onToggle={setAddOpen}>
      <CompanyForm company={null} onCancel={() => setAddOpen(false)} onSaved={() => saved("Company berhasil ditambahkan.")} />
    </Collapsible>
    <Drawer isOpen={drawerOpen} onClose={closeDrawer} size="md">
      <Drawer.Header title="Edit Company" subtitle={editTarget?.name ?? "Perbarui data perusahaan"} onClose={closeDrawer} />
      <Drawer.Body><CompanyForm company={editTarget} onCancel={closeDrawer} onSaved={() => { saved("Company berhasil diperbarui."); closeDrawer(); }} /></Drawer.Body>
    </Drawer>
    <Collapsible title="Daftar Company" subtitle="Cari, urutkan, atau ekspor data perusahaan" defaultOpen>
      <Table ref={tableRef} url="/companies" columns={columns} dataKey="data" pageSize={15} exportName="companies_export" title="" searchable selectable={false} serverSide serverSideFiltering tableId="companies" />
    </Collapsible>
  </div>;
}
