import { useState, useEffect, useCallback } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../components/ui/Toast";
import { Building2, Plus, Pencil, PowerOff } from "lucide-react";
import styles from "./VendorManagement.module.css";

// ─── API helper ───────────────────────────────────────────────
const api = (path, options = {}) => {
  const token =
    localStorage.getItem("appacc_token") ??
    sessionStorage.getItem("appacc_token");
  return fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  }).then((r) => {
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  });
};

// ─── Konstanta service_type ────────────────────────────────────
const SERVICE_TYPES = [
  { value: "", label: "— Pilih Jenis Layanan —" },
  { value: "barang", label: "Barang" },
  { value: "jasa", label: "Jasa" },
  { value: "barang_jasa", label: "Barang & Jasa" },
];

// ─── Vendor Form Modal (Add / Edit) ───────────────────────────
function VendorFormModal({ vendor, onClose, onSaved }) {
  const isEdit = Boolean(vendor);

  const [form, setForm] = useState({
    vendor_code: vendor?.sap_id ?? "",
    name: vendor?.name ?? "",
    npwp: vendor?.npwp ?? "",
    address: vendor?.address ?? "",
    service_type: vendor?.service_type ?? "",
    is_active: vendor?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const err = {};
    console.log(form.vendor_code.toString().length);
    if (!form.vendor_code.toString().length == 6)
      err.vendor_code = "Kode vendor wajib diisi.";
    if (!form.name?.trim?.()) err.name = "Nama vendor wajib diisi.";
    if (!form.service_type) err.service_type = "Pilih jenis layanan.";
    return err;
  };

  const handleSave = async () => {
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const res = isEdit
        ? await api(`/vendors/${vendor.id}`, {
            method: "PUT",
            body: JSON.stringify(form),
          })
        : await api("/vendors", {
            method: "POST",
            body: JSON.stringify(form),
          });
      onSaved(res.data, isEdit);
    } catch (e) {
      setErrors({
        general: isEdit
          ? "Gagal menyimpan perubahan."
          : "Gagal menambah vendor. Kode vendor mungkin sudah ada.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="md">
      <Modal.Header
        onClose={onClose}
        title={isEdit ? `Edit Vendor: ${vendor.name}` : "Tambah Vendor Baru"}
        subtitle={
          isEdit
            ? `Kode: ${vendor.vendor_code}`
            : "Isi data vendor dengan lengkap"
        }
      />
      <Modal.Body>
        <div className={styles.formGrid}>
          <Input
            label="Kode Vendor"
            placeholder="contoh: V-0001"
            value={form.vendor_code}
            onChange={set("vendor_code")}
            error={errors.vendor_code}
            disabled={isEdit}
            hint={isEdit ? "Kode vendor tidak dapat diubah." : ""}
          />
          <Input
            label="Nama Vendor"
            placeholder="Nama perusahaan atau perorangan"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
          />
          <Input
            label="NPWP"
            placeholder="XX.XXX.XXX.X-XXX.XXX"
            value={form.npwp}
            onChange={set("npwp")}
            error={errors.npwp}
          />
          <Select
            label="Jenis Layanan"
            value={form.service_type}
            onChange={set("service_type")}
            options={SERVICE_TYPES}
            error={errors.service_type}
            placeholder="Pilih jenis layanan"
          />
          <div className={`${styles.formField} ${styles.fullWidth}`}>
            <label className={styles.label}>Alamat</label>
            <textarea
              className={styles.textarea}
              placeholder="Alamat lengkap vendor"
              value={form.address}
              onChange={set("address")}
              rows={3}
            />
          </div>
          {isEdit && (
            <div className={styles.formField}>
              <label className={styles.label}>Status</label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${form.is_active ? styles.toggleActive : styles.toggleInactive}`}
                  onClick={() =>
                    setForm((p) => ({ ...p, is_active: !p.is_active }))
                  }
                >
                  {form.is_active ? "Aktif" : "Nonaktif"}
                </button>
              </div>
            </div>
          )}
        </div>
        {errors.general && (
          <p className={`${styles.errorText} ${styles.errorGeneral}`}>
            {errors.general}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>
          {isEdit ? "Simpan Perubahan" : "Tambah Vendor"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ─── Confirm Deactivate Modal ──────────────────────────────────
function DeactivateModal({ vendor, onClose, onConfirm, loading }) {
  return (
    <Modal isOpen onClose={onClose} size="sm">
      <Modal.Header onClose={onClose} title="Nonaktifkan Vendor" />
      <Modal.Body>
        <p className={styles.confirmText}>
          Vendor <strong>{vendor.name}</strong> ({vendor.vendor_code}) akan
          dinonaktifkan dan tidak bisa dipilih di transaksi baru. Data lama
          tetap aman.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Ya, Nonaktifkan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filterStatus, setFilter] = useState(""); // '' | 'true' | 'false'
  const [loading, setLoading] = useState(true);
  const [formTarget, setFormTarget] = useState(undefined); // undefined=closed, null=new, object=edit
  const [deactTarget, setDeact] = useState(null);
  const [deactLoading, setDeactL] = useState(false);
  const { addToast } = useToast();

  const fetchVendors = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, per_page: 15 });
    if (query) params.set("search", query);
    if (filterStatus) params.set("is_active", filterStatus);

    api(`/vendors?${params}`)
      .then((res) => {
        setVendors(res.data);
        setMeta(res.meta);
      })
      .catch(() =>
        addToast({ variant: "danger", title: "Gagal memuat data vendor." }),
      )
      .finally(() => setLoading(false));
  }, [page, query, filterStatus]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const handleFilterChange = (val) => {
    setFilter(val);
    setPage(1);
  };

  const handleSaved = (data, isEdit) => {
    if (isEdit) {
      setVendors((prev) => prev.map((v) => (v.id === data.id ? data : v)));
      addToast({
        variant: "success",
        title: `Vendor "${data.name}" diperbarui.`,
      });
    } else {
      fetchVendors();
      addToast({
        variant: "success",
        title: `Vendor "${data.name}" ditambahkan.`,
      });
    }
    setFormTarget(undefined);
  };

  const handleDeactivate = async () => {
    setDeactL(true);
    try {
      await api(`/vendors/${deactTarget.id}`, { method: "DELETE" });
      setVendors((prev) =>
        prev.map((v) =>
          v.id === deactTarget.id ? { ...v, is_active: false } : v,
        ),
      );
      addToast({
        variant: "info",
        title: `${deactTarget.name} dinonaktifkan.`,
      });
      setDeact(null);
    } catch {
      addToast({ variant: "danger", title: "Gagal menonaktifkan vendor." });
    } finally {
      setDeactL(false);
    }
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
        <div className={styles.filterGroup}>
          {[
            { val: "", label: "Semua" },
            { val: "true", label: "Aktif" },
            { val: "false", label: "Nonaktif" },
          ].map(({ val, label }) => (
            <button
              key={val}
              className={`${styles.filterBtn} ${filterStatus === val ? styles.filterBtnActive : ""}`}
              onClick={() => handleFilterChange(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <form className={styles.searchRow} onSubmit={handleSearch}>
          <Input
            type="search"
            placeholder="Cari nama, kode, NPWP…"
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
              <th>Kode</th>
              <th>Nama Vendor</th>
              <th>NPWP</th>
              <th>Jenis Layanan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}>
                      <div className={styles.skeleton} />
                    </td>
                  ))}
                </tr>
              ))
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan={6}>
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
                  <td>
                    <Badge
                      variant={v.is_active ? "success" : "default"}
                      pill
                      size="sm"
                    >
                      {v.is_active ? "Aktif" : "Nonaktif"}
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
                      {v.is_active && (
                        <Button
                          variant="danger"
                          size="sm"
                          iconLeft={<PowerOff size={13} />}
                          onClick={() => setDeact(v)}
                          title="Nonaktifkan vendor"
                        />
                      )}
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

      {/* Modals */}
      {formTarget !== undefined && (
        <VendorFormModal
          vendor={formTarget}
          onClose={() => setFormTarget(undefined)}
          onSaved={handleSaved}
        />
      )}
      {deactTarget && (
        <DeactivateModal
          vendor={deactTarget}
          onClose={() => setDeact(null)}
          onConfirm={handleDeactivate}
          loading={deactLoading}
        />
      )}
    </div>
  );
}
