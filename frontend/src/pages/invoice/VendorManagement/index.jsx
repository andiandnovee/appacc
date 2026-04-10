import { useState, useEffect, useCallback } from "react";
import VendorFormModal from "./VendorFormModal";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Input from "../../../components/ui/Input";
import Pagination from "../../../components/ui/Pagination";
import EmptyState from "../../../components/ui/EmptyState";
import { useToast } from "../../../components/ui/Toast";
import { Building2, Plus, Pencil } from "lucide-react";
import styles from "./VendorManagement.module.css";

// ─── API helper ───────────────────────────────────────────────
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
  }).then((r) => {
    return r.json().then((json) => {
      if (!r.ok) {
        const error = new Error(json.message || r.statusText);
        error.status = r.status;
        error.errors = json.errors || {};
        throw error;
      }
      return json;
    });
  });
};

// ─── Konstanta service_type (sesuai backend enum) ─────────────
const SERVICE_TYPES = [
  { value: "", label: "— Pilih Jenis Layanan —" },
  { value: "HF9", label: "HF9 - Barang/Jasa Umum" },
  { value: "HT4", label: "HT4 - Layanan Khusus" },
  { value: "OTHER", label: "Lainnya" },
];

// ─── Main Page ─────────────────────────────────────────────────
export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [formTarget, setFormTarget] = useState(undefined);
  const { addToast } = useToast();

  const fetchVendors = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, per_page: 15 });
    if (query) params.set("search", query);

    api(`/vendors?${params}`)
      .then((res) => {
        setVendors(res.data);
        setMeta(res.meta);
      })
      .catch((e) => {
        console.error("Fetch error:", e);
        addToast({ variant: "danger", title: "Gagal memuat data vendor." });
      })
      .finally(() => setLoading(false));
  }, [page, query, addToast]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const handleSaved = (data, isEdit) => {
    if (isEdit) {
      setVendors((prev) => prev.map((v) => (v.id === data.id ? data : v)));
      addToast({
        variant: "success",
        title: `Vendor "${data.name}" diperbarui.`,
      });
    } else {
      setPage(1);
      fetchVendors();
      addToast({
        variant: "success",
        title: `Vendor "${data.name}" ditambahkan.`,
      });
    }
    setFormTarget(undefined);
  };

  const serviceLabel = (val) =>
    SERVICE_TYPES.find((t) => t.value === val)?.label ?? val ?? "—";

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manajemen Vendor</h1>
          <p className={styles.pageSubtitle}>
            Kelola data vendor dan rekanan perusahaan
          </p>
        </div>
        <Button
          iconLeft={<Plus size={14} />}
          onClick={() => setFormTarget(null)}
        >
          Tambah Vendor
        </Button>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <form className={styles.searchRow} onSubmit={handleSearch}>
          <Input
            type="search"
            placeholder="Cari nama, SAP ID, NPWP…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="sm"
          />
          <Button type="submit" size="sm">
            Cari
          </Button>
        </form>
      </div>

      {/* Info */}
      <p className={styles.info}>{meta.total ?? "—"} vendor ditemukan</p>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SAP ID</th>
              <th>Nama Vendor</th>
              <th>NPWP</th>
              <th>Jenis Layanan</th>
              <th>PPh</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j}>
                      <div className={styles.skeleton} />
                    </td>
                  ))}
                </tr>
              ))
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    title="Tidak ada vendor ditemukan"
                    description={
                      query
                        ? `Tidak ada hasil untuk "${query}"`
                        : "Belum ada vendor terdaftar. Tambah vendor baru."
                    }
                  />
                </td>
              </tr>
            ) : (
              vendors.map((v) => (
                <tr key={v.id} className={styles.row}>
                  <td>
                    <span className={styles.vendorCode}>{v.sap_id}</span>
                  </td>
                  <td>
                    <div className={styles.vendorName}>
                      <Building2 size={14} className={styles.vendorIcon} />
                      {v.name}
                    </div>
                    {v.address && (
                      <p className={styles.vendorAddress}>{v.address}</p>
                    )}
                  </td>
                  <td className={styles.muted}>{v.npwp || "—"}</td>
                  <td className={styles.muted}>
                    {serviceLabel(v.service_type)}
                  </td>
                  <td className={styles.muted}>
                    {v.pph_type && `${v.pph_type}% (${v.pph_rate}%)`}
                  </td>
                  <td>
                    <Badge
                      variant={v.deleted_at === null ? "success" : "default"}
                      pill
                      size="sm"
                    >
                      {v.deleted_at === null ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="outline"
                        size="sm"
                        iconLeft={<Pencil size={13} />}
                        onClick={() => setFormTarget(v)}
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <Pagination
          page={meta.current_page}
          totalPages={meta.last_page}
          totalRows={meta.total}
          pageSize={meta.per_page}
          onChange={(p) => setPage(p)}
        />
      )}

      {/* Modal */}
      {formTarget !== undefined && (
        <VendorFormModal
          vendor={formTarget}
          onClose={() => setFormTarget(undefined)}
          onSaved={handleSaved}
          api={api}
        />
      )}
    </div>
  );
}
