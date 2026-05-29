/**
 * F53HelperPage.tsx
 * Path: frontend/src/pages/sap/F53HelperPage.tsx
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Download,
  FileDown,
  Info,
  Building2,
  Layers,
  MapPin,
  CheckSquare,
  AlertCircle,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react";

import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import { useFilterF53Store } from "../../../stores/filterF53";
import { downloadF53, downloadF53Batch } from "../../../utils/sapShortcuts";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Badge from "../../../components/ui/Badge";
import Collapsible from "../../../components/ui/Collapsible";

import styles from "./F53HelperPage.module.css";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Company {
  id: string; // SAP code, misal "3500"
  name: string;
  accbank: string;
  company_id: string; // surrogate id, misal "2"
}

interface Stage {
  id: number;
  name: string;
  stage_text?: string;
}

interface BusArea {
  id: number;
  sap_id: string;
  name: string;
  company_id: number;
}

interface F53Row {
  id: number;
  doc_number: string;
  doc_date: string;
  business_area: string;
  amount: number;
  po_number: string | null;
  po_text: string | null;
  reference: string | null;
  vendor_name: string;
  vendor_sap_id: string;
  company_code: string;
  assignment: string;
}

type CheckedMap = Record<number, boolean>;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Deteksi row perjalanan dinas — po_text mengandung SAKU atau MKN */
function isSakuMkn(poText: string | null): boolean {
  if (!poText) return false;
  const upper = poText.toUpperCase();
  return upper.includes("SAKU") || upper.includes("MKN");
}

/**
 * Group rows terpilih untuk generate F53.
 * - Normal : group by vendor_sap_id → 1 file per vendor
 * - Perdin : group by reference     → 1 file per pejalan dinas
 */
function groupRows(rows: F53Row[], checked: CheckedMap) {
  const selected = rows.filter((r) => checked[r.id]);

  const map = new Map<
    string,
    {
      vendorName: string;
      vendorSapId: string;
      docDate: string;
      xblnr: string;
      isPerdin: boolean;
      rows: F53Row[];
      totalAmount: number;
    }
  >();

  for (const row of selected) {
    const perdin = isSakuMkn(row.po_text);
    const key = perdin
      ? `perdin__${row.reference ?? row.vendor_sap_id}`
      : row.vendor_sap_id || row.vendor_name;

    if (!map.has(key)) {
      map.set(key, {
        vendorName: row.vendor_name,
        vendorSapId: row.vendor_sap_id,
        docDate: row.doc_date,
        xblnr: perdin ? (row.reference ?? row.vendor_name) : row.vendor_name,
        isPerdin: perdin,
        rows: [],
        totalAmount: 0,
      });
    }
    const g = map.get(key)!;
    g.rows.push(row);
    g.totalAmount += Number(row.amount);
    if (row.doc_date > g.docDate) g.docDate = row.doc_date;
  }

  return Array.from(map.values());
}

/** Copy text ke clipboard, fallback ke execCommand kalau bukan secure context */
async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // fall through
    }
  }
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.focus();
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

// ─────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────
export default function F53HelperPage() {
  const { user } = useAuth();

  // ── Zustand filter store ──────────────────────
  const {
    selectedCompany,
    selectedStage,
    selectedBusArea,
    selectedVendor,
    postingDate,
    setSelectedCompany,
    setSelectedStage,
    setSelectedBusArea,
    setSelectedVendor,
    setPostingDate,
    setHeaderSuffix,
    getHeaderSuffix,
  } = useFilterF53Store();

  // headerSuffix per busArea
  const headerSuffix = getHeaderSuffix(selectedBusArea);
  const handleHeaderSuffixChange = (val: string) => {
    if (selectedBusArea) setHeaderSuffix(selectedBusArea, val);
  };

  // ── Ref data ─────────────────────────────────
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [busAreas, setBusAreas] = useState<BusArea[]>([]);

  // ── selectedVendorName: disimpan terpisah karena AsyncSelect
  // hanya expose value (sap_id), bukan object lengkap
  const [selectedVendorName, setSelectedVendorName] = useState<string>("");

  // ── Table data ───────────────────────────────
  const [rows, setRows] = useState<F53Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Form errors ───────────────────────────────
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ── Checklist ────────────────────────────────
  const [checked, setChecked] = useState<CheckedMap>({});

  // ── Generating ────────────────────────────────
  const [generating, setGenerating] = useState(false);

  // ── Search po_text — client-side filter di tabel
  const [poTextSearch, setPoTextSearch] = useState("");

  // ─────────────────────────────────────────────
  // Derived values — SEBELUM fetchRows
  // ─────────────────────────────────────────────
  const activeCompany = useMemo(
    () => companies.find((c) => String(c.id) === String(selectedCompany)),
    [companies, selectedCompany],
  );
  const activeStage = useMemo(
    () => stages.find((s) => String(s.id) === String(selectedStage)),
    [stages, selectedStage],
  );
  const activeBusArea = useMemo(
    () => busAreas.find((b) => String(b.id) === String(selectedBusArea)),
    [busAreas, selectedBusArea],
  );

  // canFetch: vendor cukup ada nilai (sap_id string)
  const canFetch = Boolean(selectedCompany && selectedStage && selectedBusArea);

  // canFetchRows: butuh vendor juga
  const canFetchRows = Boolean(canFetch && selectedVendor);

  // ─────────────────────────────────────────────
  // Load ref data
  // ─────────────────────────────────────────────
  useEffect(() => {
    api.get("/companies/select-options").then((r) => {
      setCompanies(r.data?.data ?? r.data ?? []);
    });
    api.get("/stages").then((r) => {
      setStages(r.data?.data ?? r.data ?? []);
    });
  }, []);

  // Load busAreas saat company berubah
  useEffect(() => {
    if (!selectedCompany || companies.length === 0) {
      setBusAreas([]);
      return;
    }
    const active = companies.find(
      (c) => String(c.id) === String(selectedCompany),
    );
    api
      .get("/busa", {
        params: {
          company_id: active?.company_id ?? selectedCompany,
          per_page: 999,
        },
      })
      .then((r) => setBusAreas(r.data?.data ?? r.data ?? []));
  }, [selectedCompany, companies]);

  // Reset vendor + rows saat busArea berubah
  useEffect(() => {
    setSelectedVendor("");
    setSelectedVendorName("");
    setRows([]);
    setChecked({});
    setPoTextSearch("");
  }, [selectedBusArea]);

  // ─────────────────────────────────────────────
  // Load F53 rows — trigger saat vendor dipilih
  // ─────────────────────────────────────────────
  const fetchRows = useCallback(async () => {
    if (!canFetchRows || !activeCompany || !activeBusArea) {
      setRows([]);
      return;
    }
    setLoading(true);
    setError(null);
    setChecked({});
    try {
      const res = await api.get("/sap/f53-data", {
        params: {
          company_id: activeCompany.id, // SAP code "3500"
          stage_id: selectedStage, // surrogate id stages
          business_area: activeBusArea.sap_id, // SAP int "3522"
          vendor_sap_id: selectedVendor, // SAP id vendor "102768"
          per_page: 999,
        },
      });
      setRows(res.data?.data ?? res.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [
    canFetchRows,
    activeCompany,
    activeBusArea,
    selectedStage,
    selectedVendor,
  ]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // ─────────────────────────────────────────────
  // Computed
  // ─────────────────────────────────────────────
  const headerText = activeBusArea
    ? `${activeBusArea.sap_id}-${headerSuffix}`
    : headerSuffix;

  // Filter rows by po_text search (client-side)
  const filteredRows = poTextSearch.trim()
    ? rows.filter(
        (r) =>
          (r.po_text ?? "")
            .toLowerCase()
            .includes(poTextSearch.toLowerCase()) ||
          (r.reference ?? "")
            .toLowerCase()
            .includes(poTextSearch.toLowerCase()),
      )
    : rows;

  const selectedRows = filteredRows.filter((r) => checked[r.id]);
  const vendorGroups = useMemo(
    () => groupRows(filteredRows, checked),
    [rows, checked],
  );
  const grandTotal = selectedRows.reduce((s, r) => s + Number(r.amount), 0);

  // Ambil dari assignment baris terpilih — berisi nilai asli SAP "II MEI'26"
  // fallback ke nama stage kalau belum ada rows tercentang
  const stageText =
    selectedRows[0]?.assignment ??
    activeStage?.stage_text ??
    activeStage?.name ??
    "";

  const allChecked =
    filteredRows.length > 0 && filteredRows.every((r) => checked[r.id]);
  const someChecked = filteredRows.some((r) => checked[r.id]);

  // canGenerate — dideklarasi sebelum useCallback supaya bisa masuk dependency
  const canGenerate =
    selectedRows.length > 0 && Boolean(postingDate) && Boolean(headerSuffix);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      setChecked({});
    } else {
      const next: CheckedMap = {};
      filteredRows.forEach((r) => {
        next[r.id] = true;
      });
      setChecked(next);
    }
  }, [allChecked, filteredRows]);

  const toggleRow = (id: number) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  // ─────────────────────────────────────────────
  // Validate & Generate
  // ─────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!postingDate) errs.postingDate = "Tanggal posting wajib diisi";
    if (!headerSuffix.trim()) errs.headerSuffix = "Wajib diisi";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }, [postingDate, headerSuffix]);

  const handleGenerate = useCallback(async () => {
    if (!validate()) return;
    if (selectedRows.length === 0) return;
    if (!activeCompany?.accbank) {
      alert(
        "Bank account company tidak ditemukan. Pastikan data company sudah lengkap (field accbank).",
      );
      return;
    }

    setGenerating(true);
    try {
      vendorGroups.forEach((group) => {
        const augtx = group.isPerdin
          ? `U.SAKU/MKN ${group.xblnr}`
          : `TAG ${stageText}/${group.vendorName}`;
        const sgtxt = group.isPerdin
          ? `U.SAKU/MKN ${group.xblnr}`
          : `BYR TAG ${stageText}/${group.vendorName}`;
        const xblnr = group.isPerdin ? group.xblnr : group.vendorName;

        downloadF53({
          sapUser: user?.sap_user ?? "",
          sapServer: user?.sap_server_con ?? "",
          companyCode: activeCompany!.id,
          businessArea: activeBusArea?.sap_id ?? selectedBusArea,
          bankAccount: activeCompany!.accbank,
          postingDate,
          headerText,
          stageText,
          vendorName: group.vendorName,
          vendorSapId: group.vendorSapId,
          docDate: group.docDate,
          totalAmount: group.totalAmount,
          augtxOverride: augtx,
          sgtxtOverride: sgtxt,
          xblnrOverride: xblnr,
        });
      });

      const docNumbers = selectedRows.map((r) => r.doc_number).join("\n");
      await copyToClipboard(docNumbers);
    } finally {
      setGenerating(false);
    }
  }, [
    validate,
    selectedRows,
    activeCompany,
    activeBusArea,
    selectedBusArea,
    vendorGroups,
    user,
    postingDate,
    headerText,
    stageText,
  ]);

  // ── Keyboard shortcuts ────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if ((e.ctrlKey && e.key === "g") || (e.ctrlKey && e.key === "G")) {
        e.preventDefault();
        if (canGenerate && !generating) handleGenerate();
      }
      if ((e.ctrlKey && e.key === "a") || (e.ctrlKey && e.key === "A")) {
        e.preventDefault();
        toggleAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canGenerate, generating, handleGenerate, toggleAll]);

  // ─────────────────────────────────────────────
  // Select options
  // ─────────────────────────────────────────────
  const companyOptions = companies.map((c) => ({
    value: c.id,
    label: `${c.id} — ${c.name}`,
  }));

  const stageOptions = stages.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  const busAreaOptions = busAreas.map((b) => ({
    value: String(b.id),
    label: `${b.sap_id} — ${b.name}`,
  }));

  // fetchOptions untuk AsyncSelect vendor
  // value yang disimpan = sap_id (karena backend return sap_id as id)
  const vendorFetchOptions = canFetch
    ? {
        endpoint: "/vendors/select-options",
        searchParam: "search",
        filters: {
          company_sap_id: activeCompany?.id, // "3500"
          stage_sap_id: activeStage?.id, // "160"
          business_area: activeBusArea?.sap_id, // "3522"
        },
        limit: 10,
      }
    : null;

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* PAGE HEADER */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageIcon}>
            <FileDown size={20} />
          </div>
          <div>
            <h1 className={styles.pageTitle}>F-53 Helper</h1>
            <p className={styles.pageSubtitle}>
              Generate SAP shortcut untuk TCode F-53 (Manual Outgoing Payment)
            </p>
          </div>
        </div>
      </div>

      {/* ── STEP 1: FILTER ─────────────────────── */}
      <Card variant="outlined">
        <Card.Header
          title="1. Pilih Filter Data"
          subtitle="Pilih company, stage, dan business area"
        />
        <Card.Body>
          <div className={styles.filterGrid}>
            <Select
              label="Company"
              placeholder="Pilih company..."
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              options={companyOptions}
            />
            <Select
              label="Stage"
              placeholder="Pilih stage..."
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              options={stageOptions}
            />
            <Select
              label="Business Area"
              placeholder={
                selectedCompany
                  ? "Pilih business area..."
                  : "Pilih company dulu"
              }
              value={selectedBusArea}
              onChange={(e) => setSelectedBusArea(e.target.value)}
              disabled={!selectedCompany || busAreas.length === 0}
              options={busAreaOptions}
            />
          </div>

          {/* Filter chips */}
          {canFetch && (
            <div className={styles.filterChips}>
              {activeCompany && (
                <span className={styles.chip}>
                  <Building2 size={12} />
                  {activeCompany.id} — {activeCompany.name}
                </span>
              )}
              {activeStage && (
                <span className={styles.chip}>
                  <Layers size={12} />
                  {activeStage.name}
                  {activeStage.stage_text && (
                    <span className={styles.chipSub}>
                      {" "}
                      · {activeStage.stage_text}
                    </span>
                  )}
                </span>
              )}
              {activeBusArea && (
                <span className={styles.chip}>
                  <MapPin size={12} />
                  {activeBusArea.sap_id} · {activeBusArea.name}
                </span>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ── STEP 2: FORM HEADER ─────────────────── */}
      <Card variant="outlined">
        <Card.Header
          title="2. Input Header Pembayaran"
          subtitle="Data header akan diisi ke field BKPF di SAP"
        />
        <Card.Body>
          <div className={styles.formGrid}>
            <Input
              type="date"
              label="Tanggal Posting"
              value={postingDate}
              onChange={(e) => setPostingDate(e.target.value)}
              error={formErrors.postingDate}
              hint="Default hari ini · BKPF-BUDAT & BSEG-VALUT"
            />

            <div>
              
              <Input
  label="Nomor Header (BKPF-BKTXT)"
  placeholder="025677"
  value={headerSuffix}
  onChange={(e) => handleHeaderSuffixChange(e.target.value)}
  error={formErrors.headerSuffix}
  hint={`Hasil: ${headerText || "(belum diisi)"} · tersimpan per Business Area`}
  maxLength={10}
  disabled={!selectedBusArea}
  iconLeft={
    activeBusArea?.sap_id
      ? <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-medium)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{activeBusArea.sap_id} -</span>
      : undefined
  }
/>
            </div>
          </div>

          {/* SAP field preview */}
          {(postingDate || headerSuffix) && (
            <Collapsible
            title="Preview field SAP"
            defaultOpen={false}
            >
            <div className={styles.sapPreview}>
              
              <div className={styles.sapPreviewGrid}>
                <SapField label="BKPF-BKTXT" value={headerText || "—"} />
                <SapField label="BKPF-BUKRS" value={activeCompany?.id ?? "—"} />
                <SapField
                  label="BSEG-GSBER"
                  value={activeBusArea?.sap_id ?? "—"}
                />
                <SapField
                  label="RF05A-KONTO"
                  value={activeCompany?.accbank ?? "—"}
                  warn={Boolean(activeCompany && !activeCompany.accbank)}
                />
                <SapField label="RF05A-AGKON" value={selectedVendor || "—"} />
                <SapField
                  label="RF05A-AUGTX"
                  value={
                    stageText && selectedVendorName
                      ? `TAG ${stageText}/${selectedVendorName}`
                      : "—"
                  }
                />
                <SapField
                  label="BSEG-WRBTR"
                  value={grandTotal > 0 ? formatRupiah(grandTotal) : "—"}
                  note="total checklist"
                />
              </div>
            </div>
            </Collapsible>
          )
          }
        </Card.Body>
      </Card>

      {/* ── STEP 3: PILIH VENDOR + TABEL DATA ─────── */}
      <Card variant="outlined">
        <Card.Header
          title="3. Pilih Transaksi"
          action={
            canFetchRows ? (
              <div className={styles.headerActions}>
                {rows.length > 0 && (
                  <Button variant="outline" size="sm" onClick={toggleAll}>
                    <CheckSquare size={14} />
                    {allChecked
                      ? "Uncheck All (Ctrl + A)"
                      : "Check All (Ctrl+ A)"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchRows}
                  disabled={loading}
                >
                  <RefreshCw
                    size={14}
                    className={loading ? styles.spinning : ""}
                  />
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!canGenerate || generating}
                  loading={generating}
                  onClick={handleGenerate}
                >
                  <Download size={14} />
                  {generating
                    ? "Generating..."
                    : `Generate${vendorGroups.length > 1 ? ` (${vendorGroups.length} file) (Ctrl+G)` : " (Ctrl+G) "}`}
                </Button>
              </div>
            ) : undefined
          }
        />

        <Card.Body>
          {/* Vendor select — di dalam card tabel */}
          <div className={styles.vendorSelectRow}>
            <Select
              label="Vendor"
              placeholder={
                canFetch ? "Ketik nama vendor..." : "Lengkapi filter dulu"
              }
              value={selectedVendor}
              onChange={(e) => {
                setSelectedVendor(e.target.value);
              }}
              disabled={!canFetch}
              fetchOptions={vendorFetchOptions}
            />
            {selectedVendor && selectedVendorName && (
              <span className={styles.chip}>
                <User size={12} />
                {selectedVendor} · {selectedVendorName}
              </span>
            )}
          </div>

          {/* Search po_text — muncul kalau sudah ada rows */}
          {rows.length > 0 && (
            <div className={styles.poTextSearchRow}>
              <Input
                placeholder="Cari po_text / nama pejalan dinas..."
                value={poTextSearch}
                onChange={(e) => setPoTextSearch(e.target.value)}
                hint={
                  poTextSearch
                    ? `${filteredRows.length} dari ${rows.length} baris`
                    : undefined
                }
              />
            </div>
          )}
        </Card.Body>

        {/* Summary bar */}
        {someChecked && (
          <div className={styles.summaryBar}>
            <div className={styles.summaryLeft}>
              <CheckSquare size={16} />
              <span>
                <strong>{selectedRows.length}</strong> transaksi dipilih
              </span>
            </div>
            <div className={styles.summaryRight}>
              Total: <strong>{formatRupiah(grandTotal)}</strong>
            </div>
          </div>
        )}

        {/* State: belum pilih filter */}
        {!canFetch && (
          <div className={styles.emptyState}>
            <Layers size={36} className={styles.emptyIcon} />
            <p>Lengkapi filter company, stage, dan business area</p>
          </div>
        )}

        {/* State: filter ok tapi vendor belum dipilih */}
        {canFetch && !selectedVendor && (
          <div className={styles.emptyState}>
            <User size={36} className={styles.emptyIcon} />
            <p>Pilih vendor untuk memuat data transaksi</p>
          </div>
        )}

        {/* State: loading */}
        {canFetchRows && loading && (
          <div className={styles.loadingState}>
            <Loader2 size={24} className={styles.spinning} />
            <span>Memuat data...</span>
          </div>
        )}

        {/* State: error */}
        {canFetchRows && !loading && error && (
          <div className={styles.errorState}>
            <AlertCircle size={18} />
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchRows}>
              Coba lagi
            </Button>
          </div>
        )}

        {/* Empty */}
        {canFetchRows && !loading && !error && rows.length === 0 && (
          <div className={styles.emptyState}>
            <Info size={36} className={styles.emptyIcon} />
            <p>Tidak ada data untuk vendor dan filter yang dipilih</p>
          </div>
        )}

        {/* Tabel */}
        {canFetchRows && !loading && !error && rows.length > 0 && (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thCheck}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={allChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = !allChecked && someChecked;
                      }}
                      onChange={toggleAll}
                      title="Pilih semua"
                    />
                  </th>
                  <th>Doc Number</th>
                  <th>Tgl Invoice</th>
                  <th>PO Text</th>
                  <th>Reference</th>
                  <th>Bus Area</th>
                  <th>PO Number</th>
                  <th className={styles.thRight}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`${styles.tr} ${checked[row.id] ? styles.trSelected : ""} ${isSakuMkn(row.po_text) ? styles.trPerdin : ""}`}
                    onClick={() => toggleRow(row.id)}
                  >
                    <td
                      className={styles.tdCheck}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={!!checked[row.id]}
                        onChange={() => toggleRow(row.id)}
                      />
                    </td>
                    <td className={styles.tdMono}>{row.doc_number}</td>
                    <td>{formatDate(row.doc_date)}</td>
                    <td className={styles.tdPoText}>
                      {isSakuMkn(row.po_text) && (
                        <Badge variant="warning" size="sm">
                          perdin
                        </Badge>
                      )}
                      {row.po_text || "—"}
                    </td>
                    <td className={styles.tdMono}>{row.reference || "—"}</td>
                    <td>
                      <Badge variant="default" size="sm">
                        {row.business_area}
                      </Badge>
                    </td>
                    <td className={styles.tdMono}>{row.po_number || "—"}</td>
                    <td className={styles.tdRight}>
                      <span
                        className={
                          checked[row.id]
                            ? styles.amountSelected
                            : styles.amount
                        }
                      >
                        {formatRupiah(Number(row.amount))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

              {someChecked && (
                <tfoot>
                  <tr className={styles.tfootRow}>
                    <td colSpan={7} className={styles.tfootLabel}>
                      Total ({selectedRows.length} transaksi)
                    </td>
                    <td className={`${styles.tdRight} ${styles.tfootTotal}`}>
                      {formatRupiah(grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </Card>

      {/* ── STEP 4: validation hints ─── */}
      {!canGenerate && canFetchRows && (
        <Card variant="outlined">
          <Card.Body>
            <div className={styles.hintList}>
              {!postingDate && (
                <div className={styles.hint}>
                  <AlertCircle size={13} /> Isi Tanggal Posting
                </div>
              )}
              {!headerSuffix && (
                <div className={styles.hint}>
                  <AlertCircle size={13} /> Isi Nomor Header (BKPF-BKTXT)
                </div>
              )}
              {postingDate && headerSuffix && selectedRows.length === 0 && (
                <div className={styles.hint}>
                  <AlertCircle size={13} /> Centang minimal 1 transaksi di tabel
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-component
// ─────────────────────────────────────────────
function SapField({
  label,
  value,
  note,
  warn,
}: {
  label: string;
  value: string;
  note?: string;
  warn?: boolean;
}) {
  return (
    <div className={`${styles.sapField} ${warn ? styles.sapFieldWarn : ""}`}>
      <span className={styles.sapFieldLabel}>{label}</span>
      <span className={styles.sapFieldValue}>{value}</span>
      {note && <span className={styles.sapFieldNote}>{note}</span>}
    </div>
  );
}
