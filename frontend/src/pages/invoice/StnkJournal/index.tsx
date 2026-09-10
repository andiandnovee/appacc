// Path: src/pages/invoice/StnkJournal/index.tsx

import { useState, useCallback, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  FileText, Plus, Search, Trash2, Download,
  AlertCircle, CheckCircle, AlertTriangle,
  Pencil, Save, X, Star, RotateCcw,
} from "lucide-react";

import api from "../../../api/axios";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Badge from "../../../components/ui/Badge";
import Collapsible from "../../../components/ui/Collapsible";
import { useToast } from "../../../components/ui/Toast";

import { useStnkVendors, StnkVendorEntry } from "../../../stores/stnkVendors";
import { useStnkDraft, emptyDraftItem, DraftItem } from "../../../stores/stnkDraft";

import {
  StnkItem, StnkHeader, BusAreaMeta, VendorRO,
  isKendaraanItem,
  buildStnkKendaraanRows,
  exportStnkKendaraanExcel, exportStnkKendaraanText,
  exportStnkRoExcel, exportStnkRoText,
  exportStnkAllExcel, exportStnkAllText,
} from "./exportStnkZf0002";

import styles from "./StnkJournal.module.css";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Company {
  id: string;
  name: string;
  company_id: number;
}

interface BusinessArea {
  id: number;
  sap_id: string;
  name: string;
  name_long: string;
  sap_vendor_code: string;
  sap_customer_code: string;
  company_id: number;
  current_bus_area: boolean;
}

interface VehicleFound {
  id: number;
  plate_number: string;
  vehicle_type: "R4" | "R2";
  business_area_code: string;
  cost_center: string | null;
  description: string;
}

type LookupState = "idle" | "loading" | "found" | "not_found";

// InputItemDraft = DraftItem dari store
type InputItemDraft = DraftItem;

// (keep interface for reference)
interface _InputItemDraft_unused {
  id: string;
  plateInput: string;
  lookupState: LookupState;
  vehicle: VehicleFound | null;
  manualBusArea: string;
  manualType: "R4" | "R2";
  biayaPerpj: number;
  admPerpj: number;
  jasaPerpj: number;
  dendaPerpj: number;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function emptyDraft(): InputItemDraft {
  return {
    id: uuidv4(),
    plateInput: "",
    lookupState: "idle",
    vehicle: null,
    manualBusArea: "",
    manualType: "R4",
    biayaPerpj: 0,
    admPerpj: 0,
    jasaPerpj: 0,
    dendaPerpj: 0,
  };
}

function toNum(s: string): number {
  return parseFloat(s.replace(/,/g, "")) || 0;
}

function formatRupiah(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val);
}

// currentBaSapId dibutuhkan untuk classifier
function buildStnkItem(draft: InputItemDraft, currentBaSapId: string): StnkItem {
  const hasCostCenter = draft.lookupState === "found" && !!draft.vehicle?.cost_center;
  const costCenter = draft.vehicle?.cost_center ?? null;

  // busAreaKendaraan = punya CC DAN CC bukan current BusArea
  const busAreaKendaraan = hasCostCenter && costCenter !== currentBaSapId;

  const vehicleType: "R4" | "R2" =
    draft.lookupState === "found"
      ? (draft.vehicle?.vehicle_type ?? "R4")
      : draft.manualType;

  const businessAreaCode =
    busAreaKendaraan
      ? (draft.vehicle?.business_area_code ?? "")
      : draft.manualBusArea;

  const plate =
    draft.vehicle?.plate_number ?? draft.plateInput.trim().toUpperCase();

  const textItem = vehicleType === "R2" ? `S.MOTOR ${plate}` : plate;

  return {
    id: draft.id,
    plateNumber: plate,
    vehicleType,
    businessAreaCode,
    costCenter,
    busAreaKendaraan,
    textItem,
    biayaPerpj: draft.biayaPerpj,
    admPerpj: draft.admPerpj,
    jasaPerpj: draft.jasaPerpj,
    dendaPerpj: draft.dendaPerpj,
  };
}

const VEHICLE_TYPE_OPTIONS = [
  { value: "R4", label: "R4 — Mobil" },
  { value: "R2", label: "R2 — Motor" },
];

const JENIS_OPTIONS = [
  { value: "STNK", label: "STNK" },
  { value: "KIER", label: "KIER" },
];

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function StnkJournalPage() {
  const { addToast } = useToast();

  const {
    vendors, selectedVendorId,
    addVendor, updateVendor, removeVendor, selectVendor,
  } = useStnkVendors();

  // ── Zustand draft store ─────────────────────
  const {
    header: draftHeader,
    drafts,
    setHeader,
    addDraft: addDraftStore,
    updateDraft,
    removeDraft,
    resetAll,
  } = useStnkDraft();

  const companyCode   = draftHeader.companyCode;
  const postingDate   = draftHeader.postingDate;
  const documentDate  = draftHeader.documentDate;
  const noInvoice     = draftHeader.noInvoice;
  const docHeaderText = draftHeader.docHeaderText;
  const period        = draftHeader.period;

  // ── Master data ──────────────────────────────
  const [companies, setCompanies] = useState<Company[]>([]);
  const [busAreas, setBusAreas] = useState<BusinessArea[]>([]);
  const [masterLoaded, setMasterLoaded] = useState(false);
  const [exporting, setExporting] = useState(false);

  // vendor edit state
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [vendorDraft, setVendorDraft] = useState<Partial<StnkVendorEntry>>({});
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [newVendor, setNewVendor] = useState<Omit<StnkVendorEntry, "id">>({
    kode_vendor: "", nama_vendor: "", jenis: "STNK", tarif_pph: 2, gl_account_pph: "",
  });

  // ── Master load ──────────────────────────────
  const loadMaster = useCallback(async () => {
    if (masterLoaded) return;
    try {
      const res = await api.get("/companies/select-options");
      setCompanies(res.data?.data ?? res.data ?? []);
      setMasterLoaded(true);
    } catch {
      addToast({ variant: "danger", title: "Gagal memuat data company." });
    }
  }, [masterLoaded, addToast]);

  const loadBusAreas = useCallback(async (cId: number) => {
    try {
      const res = await api.get("/busa", { params: { company_id: cId, per_page: 999 } });
      setBusAreas(res.data?.data ?? []);
    } catch { setBusAreas([]); }
  }, []);

  useEffect(() => {
    loadMaster();
    if (draftHeader.companyId) loadBusAreas(draftHeader.companyId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived ──────────────────────────────────
  const currentBusArea = useMemo(
    () => busAreas.find((b) => b.current_bus_area) ?? null,
    [busAreas],
  );
  const currentBaSapId = currentBusArea?.sap_id ?? "";

  const selectedVendor = useMemo(
    () => vendors.find((v) => v.id === selectedVendorId) ?? null,
    [vendors, selectedVendorId],
  );

  const busAreaMetaList: BusAreaMeta[] = useMemo(
    () => busAreas.map((b) => ({
      sapId: b.sap_id,
      sapVendorCode: b.sap_vendor_code,
      sapCustomerCode: b.sap_customer_code ?? "",
      isCurrent: b.current_bus_area,
    })),
    [busAreas],
  );

  // allItems — butuh currentBaSapId untuk classifier
  const allItems = useMemo(
    () => drafts.map((d) => buildStnkItem(d, currentBaSapId)),
    [drafts, currentBaSapId],
  );

  const kendDocCount = useMemo(() => {
    const groups = new Set(
      allItems.filter((i) => i.busAreaKendaraan).map((i) => i.businessAreaCode),
    );
    return groups.size;
  }, [allItems]);

  const roStartNo = kendDocCount + 1;

  const totals = useMemo(() => {
    const biaya = allItems.reduce((s, i) => s + i.biayaPerpj, 0);
    const adm   = allItems.reduce((s, i) => s + i.admPerpj, 0);
    const jasa  = allItems.reduce((s, i) => s + i.jasaPerpj, 0);
    const denda = allItems.reduce((s, i) => s + i.dendaPerpj, 0);
    const tarif = selectedVendor?.tarif_pph ?? 0;
    const pph   = Math.round((jasa * tarif) / 100);
    const byr   = biaya + adm + jasa + denda - pph;
    return { biaya, adm, jasa, denda, pph, byr, tarif };
  }, [allItems, selectedVendor]);

  const busAreaKendGroups = useMemo(() => {
    const map = new Map<string, { code: string; name: string; items: number; total: number }>();
    for (const item of allItems.filter((i) => i.busAreaKendaraan)) {
      const cur = map.get(item.businessAreaCode) ?? {
        code: item.businessAreaCode,
        name: busAreas.find((b) => b.sap_id === item.businessAreaCode)?.name ?? "",
        items: 0, total: 0,
      };
      cur.items++;
      cur.total += item.biayaPerpj + item.admPerpj + item.jasaPerpj;
      map.set(item.businessAreaCode, cur);
    }
    return Array.from(map.values());
  }, [allItems, busAreas]);

  const totalRO = totals.biaya + totals.adm + totals.jasa + totals.denda;

  // ── Plate lookup ─────────────────────────────
  const lookupPlate = useCallback(
    async (draftId: string, plate: string) => {
      if (!companyCode || !plate.trim()) {
        addToast({ variant: "warning", title: "Pilih Company Code terlebih dahulu." });
        return;
      }
      updateDraft(draftId, { lookupState: "loading" });
      try {
        const res = await api.get("/vehicles/plate-lookup", {
          params: { plate: plate.trim(), company_code: companyCode },
        });
        const { found, vehicle } = res.data;
        updateDraft(draftId, { lookupState: found ? "found" : "not_found", vehicle: found ? vehicle : null });
      } catch {
        updateDraft(draftId, { lookupState: "not_found", vehicle: null });
      }
    },
    [companyCode, addToast],
  );

  const addDraft = addDraftStore;

  // ── Build objs ───────────────────────────────
  const buildHeaderObj = (): StnkHeader => ({
    companyCode,
    postingDate: new Date(postingDate),
    documentDate: new Date(documentDate),
    noInvoice,                           // ← pakai noInvoice
    docHeaderText,
    period,
    tarifPph: selectedVendor?.tarif_pph ?? 0,
  });

  const buildVendorRO = (): VendorRO => ({
    kode_vendor: selectedVendor?.kode_vendor ?? "",
    nama_vendor: selectedVendor?.nama_vendor ?? "",
    jenis: selectedVendor?.jenis ?? "STNK",
    tarif_pph: selectedVendor?.tarif_pph ?? 0,
    gl_account_pph: selectedVendor?.gl_account_pph ?? "",
  });

  const canExportKend =
    !!companyCode && !!postingDate && !!documentDate &&
    allItems.some((i) => i.busAreaKendaraan) && !!currentBusArea && !!selectedVendor;

  const canExportRO =
    !!companyCode && !!postingDate && !!documentDate && !!noInvoice &&
    !!selectedVendor && !!currentBusArea && allItems.length > 0;

  // ── Export ───────────────────────────────────
  const handleExport = async (fn: () => void | Promise<void>, label: string) => {
    setExporting(true);
    try {
      await fn();
      addToast({ variant: "success", title: `${label} berhasil diunduh.` });
    } catch (e: any) {
      addToast({ variant: "danger", title: "Gagal export: " + e.message });
    } finally {
      setExporting(false);
    }
  };

  const h = () => buildHeaderObj();
  const meta = () => busAreaMetaList;
  const vro = () => buildVendorRO();

  const companyOptions = companies.map((c) => ({ value: c.id, label: `${c.id} — ${c.name}` }));
  const busAreaOptions  = busAreas.map((b) => ({ value: b.sap_id, label: `${b.sap_id} — ${b.name}` }));

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── PAGE HEADER ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageIcon}><FileText size={20} /></div>
          <div>
            <h1 className={styles.pageTitle}>Jurnal Perpanjangan STNK / KIER</h1>
            <p className={styles.pageSubtitle}>Generate ZF0002 BusArea Kendaraan + BusArea RO</p>
          </div>
        </div>
        <Button variant="ghost" size="sm"
          onClick={() => {
            if (confirm("Reset semua data draft? Semua input akan dihapus.")) resetAll();
          }}
        >
          <RotateCcw size={14} /> Invoice Baru
        </Button>
      </div>

      {/* ── VENDOR RO MANAGER ── */}
      <Collapsible
        title="Daftar Vendor STNK / KIER"
        subtitle={
          selectedVendor
            ? `Aktif: ${selectedVendor.nama_vendor} (${selectedVendor.jenis}) · PPh ${selectedVendor.tarif_pph}%`
            : "Pilih vendor untuk jurnal BusArea RO"
        }
        defaultOpen={true}
      >
        <div className={styles.filterCard}>
          <div className={styles.vendorList}>
            {vendors.length === 0 && (
              <p className={styles.emptyHint}>Belum ada vendor. Tambah di bawah.</p>
            )}
            {vendors.map((v) => (
              <div key={v.id}
                className={[styles.vendorRow, selectedVendorId === v.id ? styles.vendorRowActive : ""].join(" ")}
              >
                {editingVendorId === v.id ? (
                  <div className={styles.vendorEditGrid}>
                    <div className={styles.fieldWrap}>
                      <label className={styles.filterLabel}>Kode Vendor</label>
                      <input className={styles.textInput}
                        value={vendorDraft.kode_vendor ?? v.kode_vendor}
                        onChange={(e) => setVendorDraft((p) => ({ ...p, kode_vendor: e.target.value }))}
                      />
                    </div>
                    <div className={styles.fieldWrap}>
                      <label className={styles.filterLabel}>Nama Vendor</label>
                      <input className={styles.textInput}
                        value={vendorDraft.nama_vendor ?? v.nama_vendor}
                        onChange={(e) => setVendorDraft((p) => ({ ...p, nama_vendor: e.target.value.toUpperCase() }))}
                      />
                    </div>
                    <Select label="Jenis"
                      value={vendorDraft.jenis ?? v.jenis}
                      onChange={(e) => setVendorDraft((p) => ({ ...p, jenis: e.target.value as "STNK" | "KIER" }))}
                      options={JENIS_OPTIONS}
                    />
                    <div className={styles.fieldWrap}>
                      <label className={styles.filterLabel}>Tarif PPh (%)</label>
                      <input type="number" className={styles.textInput}
                        value={vendorDraft.tarif_pph ?? v.tarif_pph}
                        onChange={(e) => setVendorDraft((p) => ({ ...p, tarif_pph: parseFloat(e.target.value) || 0 }))}
                        min={0} max={100} step={0.5}
                      />
                    </div>
                    <div className={styles.fieldWrap}>
                      <label className={styles.filterLabel}>GL Account PPh</label>
                      <input className={styles.textInput}
                        value={vendorDraft.gl_account_pph ?? v.gl_account_pph}
                        onChange={(e) => setVendorDraft((p) => ({ ...p, gl_account_pph: e.target.value }))}
                        placeholder="11302001"
                      />
                    </div>
                    <div className={styles.vendorEditActions}>
                      <Button variant="primary" size="sm" onClick={() => {
                        updateVendor(v.id, vendorDraft);
                        setEditingVendorId(null); setVendorDraft({});
                      }}>
                        <Save size={13} /> Simpan
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setEditingVendorId(null); setVendorDraft({}); }}>
                        <X size={13} /> Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.vendorInfo}>
                      <span className={styles.vendorCode}>{v.kode_vendor}</span>
                      <span className={styles.vendorName}>{v.nama_vendor}</span>
                      <Badge variant={v.jenis === "STNK" ? "info" : "warning"} size="sm">{v.jenis}</Badge>
                      <span className={styles.vendorMeta}>PPh {v.tarif_pph}%</span>
                      <span className={styles.vendorMeta}>GL PPh: {v.gl_account_pph || "—"}</span>
                    </div>
                    <div className={styles.vendorActions}>
                      <Button
                        variant={selectedVendorId === v.id ? "primary" : "outline"} size="sm"
                        onClick={() => selectVendor(selectedVendorId === v.id ? null : v.id)}
                      >
                        <Star size={12} /> {selectedVendorId === v.id ? "Aktif" : "Pilih"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditingVendorId(v.id);
                        setVendorDraft({ kode_vendor: v.kode_vendor, nama_vendor: v.nama_vendor, jenis: v.jenis, tarif_pph: v.tarif_pph, gl_account_pph: v.gl_account_pph });
                      }}>
                        <Pencil size={13} />
                      </Button>
                      <Button variant="ghost" size="sm" className={styles.deleteBtn}
                        onClick={() => { if (confirm(`Hapus vendor "${v.nama_vendor}"?`)) removeVendor(v.id); }}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {showAddVendor ? (
            <div className={styles.vendorAddGrid}>
              <div className={styles.fieldWrap}>
                <label className={styles.filterLabel}>Kode Vendor</label>
                <input className={styles.textInput} value={newVendor.kode_vendor}
                  onChange={(e) => setNewVendor((p) => ({ ...p, kode_vendor: e.target.value }))}
                  placeholder="400000"
                />
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.filterLabel}>Nama Vendor</label>
                <input className={styles.textInput} value={newVendor.nama_vendor}
                  onChange={(e) => setNewVendor((p) => ({ ...p, nama_vendor: e.target.value.toUpperCase() }))}
                  placeholder="SAMSAT PEKANBARU"
                />
              </div>
              <Select label="Jenis" value={newVendor.jenis}
                onChange={(e) => setNewVendor((p) => ({ ...p, jenis: e.target.value as "STNK" | "KIER" }))}
                options={JENIS_OPTIONS}
              />
              <div className={styles.fieldWrap}>
                <label className={styles.filterLabel}>Tarif PPh (%)</label>
                <input type="number" className={styles.textInput} value={newVendor.tarif_pph}
                  onChange={(e) => setNewVendor((p) => ({ ...p, tarif_pph: parseFloat(e.target.value) || 0 }))}
                  min={0} max={100} step={0.5}
                />
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.filterLabel}>GL Account PPh</label>
                <input className={styles.textInput} value={newVendor.gl_account_pph}
                  onChange={(e) => setNewVendor((p) => ({ ...p, gl_account_pph: e.target.value }))}
                  placeholder="11302001"
                />
              </div>
              <div className={styles.vendorEditActions}>
                <Button variant="primary" size="sm" onClick={() => {
                  if (!newVendor.kode_vendor || !newVendor.nama_vendor) {
                    addToast({ variant: "warning", title: "Kode dan Nama vendor wajib diisi." });
                    return;
                  }
                  addVendor(newVendor);
                  setShowAddVendor(false);
                  setNewVendor({ kode_vendor: "", nama_vendor: "", jenis: "STNK", tarif_pph: 2, gl_account_pph: "" });
                }}>
                  <Save size={13} /> Tambah
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddVendor(false)}>
                  <X size={13} /> Batal
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowAddVendor(true)}>
              <Plus size={14} /> Tambah Vendor
            </Button>
          )}
        </div>
      </Collapsible>

      {/* ── HEADER DOKUMEN ── */}
      <Collapsible
        title="Header Dokumen"
        subtitle={
          companyCode && noInvoice
            ? `${companyCode} · No.Inv ${noInvoice}${postingDate ? " · " + postingDate : ""}`
            : "Isi data header jurnal"
        }
        defaultOpen={true}
      >
        <div className={styles.filterCard}>
          <div className={styles.headerGrid}>

            <Select label="Company Code" placeholder="Pilih company..."
              value={companyCode}
              onChange={(e) => {
                const opt = companies.find((c) => c.id === e.target.value);
                setHeader({ companyCode: e.target.value, companyId: opt?.company_id ?? null });
                if (opt?.company_id) loadBusAreas(opt.company_id);
              }}
              options={companyOptions}
            />

            <div className={styles.fieldWrap}>
              <label className={styles.filterLabel}>Posting Date</label>
              <input type="date" className={styles.dateInput} value={postingDate}
                onChange={(e) => setHeader({ postingDate: e.target.value })} />
            </div>

            <div className={styles.fieldWrap}>
              <label className={styles.filterLabel}>Document Date</label>
              <input type="date" className={styles.dateInput} value={documentDate}
                onChange={(e) => setHeader({ documentDate: e.target.value })} />
            </div>

            <div className={styles.fieldWrap}>
              <label className={styles.filterLabel}>No. Invoice</label>
              <input className={styles.textInput} value={noInvoice}
                onChange={(e) => setHeader({ noInvoice: e.target.value.toUpperCase() })}
                placeholder="INV/2026/001"
              />
            </div>

            <div className={styles.fieldWrap}>
              <label className={styles.filterLabel}>Periode</label>
              <input className={styles.textInput} value={period}
                onChange={(e) => setHeader({ period: e.target.value.toUpperCase() })}
                placeholder="01"
              />
            </div>

            <div className={styles.fieldWrap}>
              <label className={styles.filterLabel}>Document Header Text</label>
              <input className={styles.textInput} value={docHeaderText}
                onChange={(e) => setHeader({ docHeaderText: e.target.value.toUpperCase() })}
                placeholder="BY PERPJ STNK BLN ..."
              />
            </div>

          </div>

          {companyCode && (
            <div className={styles.currentBaInfo}>
              {currentBusArea ? (
                <Badge variant="success" size="sm">
                  <Star size={10} /> Current BusArea RO: {currentBusArea.sap_id} — {currentBusArea.name}
                  &nbsp;· Customer {currentBusArea.sap_customer_code}
                  &nbsp;· Vendor {currentBusArea.sap_vendor_code}
                </Badge>
              ) : (
                <Badge variant="danger" size="sm">
                  <AlertCircle size={10} /> Belum ada Current BusArea — set di halaman Business Area
                </Badge>
              )}
            </div>
          )}
        </div>
      </Collapsible>

      {/* ── DAFTAR KENDARAAN ── */}
      <Collapsible
        title={`Daftar Kendaraan (${drafts.length} item)`}
        subtitle={
          allItems.filter((i) => i.busAreaKendaraan).length > 0
            ? `${allItems.filter((i) => i.busAreaKendaraan).length} BusArea Kend · ${allItems.filter((i) => !i.busAreaKendaraan).length} RO only`
            : "Belum ada kendaraan"
        }
        defaultOpen={true}
      >
        <div className={styles.itemsSection}>
          {drafts.map((draft, idx) => (
            <DraftRow
              key={draft.id}
              draft={draft}
              idx={idx}
              busAreaOptions={busAreaOptions}
              companyCode={companyCode}
              currentBaSapId={currentBaSapId}
              onUpdate={updateDraft}
              onLookup={lookupPlate}
              onRemove={() => removeDraft(draft.id)}
              canRemove={drafts.length > 1}
            />
          ))}
          <div className={styles.addItemBar}>
            <Button variant="outline" size="sm" onClick={addDraft}>
              <Plus size={14} /> Tambah Kendaraan
            </Button>
          </div>
        </div>
      </Collapsible>

      {/* ── RINGKASAN ── */}
      <Collapsible
        title="Ringkasan & Kalkulasi"
        subtitle={`Total bayar: ${formatRupiah(totals.byr)} · PPh: ${formatRupiah(totals.pph)}`}
        defaultOpen={true}
      >
        <div className={styles.filterCard}>
          <div className={styles.summaryLayout}>

            <div className={styles.summaryTable}>
              <SummaryRow label="Total Biaya Perpj"   value={totals.biaya} />
              <SummaryRow label="Total Adm Perpj"     value={totals.adm}   />
              <SummaryRow label="Total Jasa Perpj"    value={totals.jasa}  />
              <SummaryRow label="Total Denda Perpj"   value={totals.denda} />
              <div className={styles.summaryDivider} />
              <SummaryRow label={`PPh Jasa (${totals.tarif}%)`} value={totals.pph} variant="warning" />
              <SummaryRow label="Bayar Bersih (net - PPh)" value={totals.byr} variant="primary" bold />
            </div>

            <div className={styles.busAreaPanel}>
              <p className={styles.busAreaTitle}>Jurnal BusArea Kendaraan</p>
              {busAreaKendGroups.length === 0 && (
                <p className={styles.emptyHint}>Belum ada item dengan Cost Center (non-current)</p>
              )}
              {busAreaKendGroups.map((ba, i) => (
                <div key={ba.code} className={styles.busAreaRow}>
                  <Badge variant="neutral" size="sm">No.{i + 1}</Badge>
                  <span className={styles.busAreaCode}>{ba.code}</span>
                  <span className={styles.busAreaName}>{ba.name}</span>
                  <span className={styles.busAreaCount}>{ba.items} kend</span>
                  <span className={styles.busAreaTotal}>{formatRupiah(ba.total)}</span>
                </div>
              ))}
              <div className={styles.summaryDivider} />
              <p className={styles.busAreaTitle}>Jurnal BusArea RO (semua item)</p>
              <div className={styles.busAreaRow}>
                <Badge variant="neutral" size="sm">No.{roStartNo}</Badge>
                <span className={styles.busAreaCode}>{currentBusArea?.sap_id ?? "—"}</span>
                <span className={styles.busAreaName}>{currentBusArea?.name ?? "Belum set"}</span>
                <span className={styles.busAreaCount}>{allItems.length} kend</span>
                <span className={styles.busAreaTotal}>{formatRupiah(totalRO)}</span>
              </div>
            </div>

          </div>
        </div>
      </Collapsible>

      {/* ── EXPORT ── */}
      <div className={styles.exportCard}>
        <div className={styles.exportLeft}>
          <FileText size={18} className={styles.exportIcon} />
          <div>
            <p className={styles.exportTitle}>Export Jurnal ZF0002</p>
            <p className={styles.exportNote}>
              Vendor aktif:{" "}
              {selectedVendor
                ? <strong>{selectedVendor.nama_vendor} ({selectedVendor.jenis}) · Kode {selectedVendor.kode_vendor}</strong>
                : <span className={styles.warnText}>— belum dipilih</span>}
              {noInvoice && <> · No.Inv <strong>{noInvoice}</strong></>}
            </p>
          </div>
        </div>

        <div className={styles.exportGroups}>
          <div className={styles.exportGroup}>
            <span className={styles.exportGroupLabel}>BusArea Kendaraan</span>
            <div className={styles.exportBtns}>
              <Button variant="primary" size="sm"
                onClick={() => handleExport(() => exportStnkKendaraanText(h(), allItems, meta(), vro()), "File .txt Kendaraan")}
                disabled={!canExportKend || exporting} loading={exporting}>
                <Download size={14} /> .txt
              </Button>
              <Button variant="outline" size="sm"
                onClick={() => handleExport(() => exportStnkKendaraanExcel(h(), allItems, meta(), vro()), "File .xlsx Kendaraan")}
                disabled={!canExportKend || exporting} loading={exporting}>
                <Download size={14} /> .xlsx
              </Button>
            </div>
          </div>

          <div className={styles.exportGroup}>
            <span className={styles.exportGroupLabel}>BusArea RO</span>
            <div className={styles.exportBtns}>
              <Button variant="primary" size="sm"
                onClick={() => handleExport(() => exportStnkRoText(h(), allItems, meta(), vro(), roStartNo), "File .txt RO")}
                disabled={!canExportRO || exporting} loading={exporting}>
                <Download size={14} /> .txt
              </Button>
              <Button variant="outline" size="sm"
                onClick={() => handleExport(() => exportStnkRoExcel(h(), allItems, meta(), vro(), roStartNo), "File .xlsx RO")}
                disabled={!canExportRO || exporting} loading={exporting}>
                <Download size={14} /> .xlsx
              </Button>
            </div>
          </div>

          <div className={styles.exportGroup}>
            <span className={styles.exportGroupLabel}>Semua (Kend + RO)</span>
            <div className={styles.exportBtns}>
              <Button variant="primary" size="sm"
                onClick={() => handleExport(() => exportStnkAllText(h(), allItems, meta(), vro()), "File .txt All")}
                disabled={!canExportRO || exporting} loading={exporting}>
                <Download size={14} /> .txt
              </Button>
              <Button variant="outline" size="sm"
                onClick={() => handleExport(() => exportStnkAllExcel(h(), allItems, meta(), vro()), "File .xlsx All")}
                disabled={!canExportRO || exporting} loading={exporting}>
                <Download size={14} /> .xlsx
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────
// SUB-COMPONENT: DraftRow
// ─────────────────────────────────────────────
interface DraftRowProps {
  draft: InputItemDraft;
  idx: number;
  busAreaOptions: { value: string; label: string }[];
  companyCode: string;
  currentBaSapId: string;
  onUpdate: (id: string, patch: Partial<InputItemDraft>) => void;
  onLookup: (id: string, plate: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

// ─────────────────────────────────────────────
// SUB-COMPONENT: AccumInput
// Enter/Tab → tambahkan nilai ke existing, buffer kosong lagi
// ─────────────────────────────────────────────
function AccumInput({ label, value, onChange }: {
  label: string;
  value: number;
  onChange: (newVal: number) => void;
}) {
  const [buffer, setBuffer] = useState("");

  const commit = () => {
    const num = parseFloat(buffer.replace(/,/g, "")) || 0;
    if (num !== 0) {
      onChange(value + num);
      setBuffer("");
    }
  };

  return (
    <div className={styles.fieldWrap}>
      <label className={styles.filterLabel}>
        {label}
        {value > 0 && (
          <span className={styles.accumTotal}> = {formatRupiah(value)}</span>
        )}
      </label>
      <input
        type="number"
        className={styles.textInput}
        value={buffer}
        onChange={(e) => setBuffer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
        placeholder={value > 0 ? `+tambah` : "0"}
        min={0}
      />
    </div>
  );
}

function DraftRow({
  draft, idx, busAreaOptions, companyCode, currentBaSapId,
  onUpdate, onLookup, onRemove, canRemove,
}: DraftRowProps) {
  const item = buildStnkItem(draft, currentBaSapId);
  const isCurrentBaItem = !!draft.vehicle?.cost_center &&
    draft.vehicle.cost_center === currentBaSapId;

  const needsManualBusArea =
    draft.lookupState === "not_found" ||
    (draft.lookupState === "found" && !draft.vehicle?.cost_center);
  const needsManualType = draft.lookupState === "not_found";

  const totalItem = draft.biayaPerpj + draft.admPerpj + draft.jasaPerpj + draft.dendaPerpj;

  return (
    <div className={styles.draftCard}>
      <div className={styles.draftHeader}>
        <span className={styles.draftNo}>#{idx + 1}</span>

        {draft.lookupState === "found" && draft.vehicle?.cost_center && !isCurrentBaItem && (
          <Badge variant="success" size="sm">
            <CheckCircle size={10} />
            {draft.vehicle.business_area_code} · CC {draft.vehicle.cost_center}
          </Badge>
        )}
        {draft.lookupState === "found" && isCurrentBaItem && (
          <Badge variant="info" size="sm">
            <Star size={10} /> CC = Current BusArea → RO (GL 71830001)
          </Badge>
        )}
        {draft.lookupState === "found" && !draft.vehicle?.cost_center && (
          <Badge variant="warning" size="sm">
            <AlertTriangle size={10} /> Tidak ada Cost Center → RO only
          </Badge>
        )}
        {draft.lookupState === "not_found" && (
          <Badge variant="danger" size="sm">
            <AlertCircle size={10} /> Tidak ditemukan → RO only
          </Badge>
        )}

        {draft.vehicle && (
          <span className={styles.vehicleDesc}>{draft.vehicle.description}</span>
        )}

        {canRemove && (
          <button className={styles.btnRemove} onClick={onRemove} title="Hapus item">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className={styles.draftBody}>
        <div className={styles.plateGroup}>
          <div className={styles.fieldWrap}>
            <label className={styles.filterLabel}>Plat Nomor</label>
            <div className={styles.plateInputWrap}>
              <input
                className={styles.textInput}
                value={draft.plateInput}
                onChange={(e) =>
                  onUpdate(draft.id, { plateInput: e.target.value, lookupState: "idle", vehicle: null })
                }
                onKeyDown={(e) => { if (e.key === "Enter") onLookup(draft.id, draft.plateInput); }}
                placeholder="BM 1234 AB"
                disabled={!companyCode}
              />
              <Button variant="outline" size="sm"
                onClick={() => onLookup(draft.id, draft.plateInput)}
                disabled={!companyCode || !draft.plateInput.trim() || draft.lookupState === "loading"}
                loading={draft.lookupState === "loading"}
              >
                <Search size={14} /> Cari
              </Button>
            </div>
          </div>

          {needsManualType && (
            <Select label="Jenis Kendaraan" value={draft.manualType}
              onChange={(e) => onUpdate(draft.id, { manualType: e.target.value as "R4" | "R2" })}
              options={VEHICLE_TYPE_OPTIONS}
            />
          )}

          {needsManualBusArea && (
            <Select label="Business Area (Manual)" placeholder="-- Pilih BusArea --"
              value={draft.manualBusArea}
              onChange={(e) => onUpdate(draft.id, { manualBusArea: e.target.value })}
              options={busAreaOptions}
            />
          )}
        </div>

        <div className={styles.biayaGrid}>
          {([
            { key: "biayaPerpj" as const, label: "Biaya Perpj" },
            { key: "admPerpj"   as const, label: "Adm Perpj"   },
            { key: "jasaPerpj"  as const, label: "Jasa Perpj"  },
            { key: "dendaPerpj" as const, label: "Denda Perpj" },
          ]).map(({ key, label }) => (
            <AccumInput
              key={key}
              label={label}
              value={draft[key] as number}
              onChange={(newVal) => onUpdate(draft.id, { [key]: newVal })}
            />
          ))}
        </div>

        {totalItem > 0 && (
          <div className={styles.itemSummary}>
            <span>Text SAP: <strong>{item.textItem}</strong></span>
            <span>
              <Badge variant={item.busAreaKendaraan ? "success" : "warning"} size="sm">
                {item.busAreaKendaraan ? `Kend (${item.businessAreaCode})` : "RO only"}
              </Badge>
            </span>
            <span>Total: <strong>{formatRupiah(totalItem)}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SUB-COMPONENT: SummaryRow
// ─────────────────────────────────────────────
function SummaryRow({ label, value, variant, bold }: {
  label: string; value: number;
  variant?: "primary" | "warning"; bold?: boolean;
}) {
  return (
    <div className={[
      styles.summaryRow,
      variant === "primary" ? styles.summaryPrimary : "",
      variant === "warning" ? styles.summaryWarning : "",
      bold ? styles.summaryBold : "",
    ].filter(Boolean).join(" ")}>
      <span className={styles.summaryLabel}>{label}</span>
      <span className={styles.summaryValue}>{formatRupiah(value)}</span>
    </div>
  );
}