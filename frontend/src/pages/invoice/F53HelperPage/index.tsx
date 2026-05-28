/**
 * F53HelperPage.tsx
 * Path: frontend/src/pages/sap/F53HelperPage.tsx
 *
 * Page untuk generate SAP F-53 shortcut (.sap) dari data sap_f53_uploads.
 *
 * Alur:
 * 1. User pilih Company → Stage → Business Area (filter)
 * 2. Data dari sap_f53_uploads muncul di tabel
 * 3. User isi form header: Posting Date + Header suffix (angka)
 * 4. User centang baris yang ingin disertakan
 * 5. Klik "Generate Shortcut" → download .sap per vendor
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
} from "lucide-react";

import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import { downloadF53Batch } from "../../../utils/sapShortcuts";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Badge from "../../../components/ui/Badge";

import styles from "./F53HelperPage.module.css";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Company {
  id: number; 
  sap_id: string; // misal "4000"
  name: string;
  accbank: string; // RF05A-KONTO, misal "11122329"
}

interface Stage {
  id: number;
  name: string;
  stage_text?: string; // misal "I MEI'26" — kalau belum ada di DB, fallback ke name
}

interface BusArea {
  id: number;
  sap_id: string; // misal "4050"
  name: string;
  company_id: number;
}

interface F53Row {
  id: number;
  doc_number: string;
  doc_date: string; // "2026-03-13"
  business_area: string; // "4050"
  amount: number; // sudah sign-flip, positif
  po_number: string | null;
  vendor_name: string;
  vendor_sap_id: string; // RF05A-AGKON
  company_code: string;
}

type CheckedMap = Record<number, boolean>;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

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

/** Group rows terpilih by vendor SAP ID */
function groupByVendor(rows: F53Row[], checked: CheckedMap) {
  const selected = rows.filter((r) => checked[r.id]);
  const map = new Map<
    string,
    {
      vendorName: string;
      vendorSapId: string;
      docDate: string;
      rows: F53Row[];
      totalAmount: number;
    }
  >();

  for (const row of selected) {
    const key = row.vendor_sap_id || row.vendor_name;
    if (!map.has(key)) {
      map.set(key, {
        vendorName: row.vendor_name,
        vendorSapId: row.vendor_sap_id,
        docDate: row.doc_date,
        rows: [],
        totalAmount: 0,
      });
    }
    const g = map.get(key)!;
    g.rows.push(row);
    g.totalAmount += Number(row.amount);
  }

  return Array.from(map.values());
}

// ─────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────
export default function F53HelperPage() {
  const { user } = useAuth();

  // ── Filter state ─────────────────────────────
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [selectedBusArea, setSelectedBusArea] = useState<string>("");

  // ── Ref data ─────────────────────────────────
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [busAreas, setBusAreas] = useState<BusArea[]>([]);

  // ── Table data ───────────────────────────────
  const [rows, setRows] = useState<F53Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Form header ───────────────────────────────
  const [postingDate, setPostingDate] = useState(todayIso());
  const [headerSuffix, setHeaderSuffix] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ── Checklist ────────────────────────────────
  const [checked, setChecked] = useState<CheckedMap>({});

  // ── Generating ────────────────────────────────
  const [generating, setGenerating] = useState(false);

  // ─────────────────────────────────────────────
  // Load ref data
  // ─────────────────────────────────────────────
  useEffect(() => {
    api.get("/companies/select-options").then((r) => {
      const data = r.data?.data ?? r.data ?? [];
      setCompanies(data);
    });
    api.get("/stages").then((r) => {
      const data = r.data?.data ?? r.data ?? [];
      setStages(data);
    });
  }, []);

  // Load busAreas saat company berubah
  useEffect(() => {
    if (!selectedCompany) {
      setBusAreas([]);
      return;
    }
    api
      .get("/busa", { params: { company_id: selectedCompany, per_page: 999 } })
      .then((r) => setBusAreas(r.data?.data ?? r.data ?? []));
    setSelectedBusArea("");
  }, [selectedCompany]);

  // ─────────────────────────────────────────────
  // Load F53 rows
  // ─────────────────────────────────────────────
  const canFetch = Boolean(selectedCompany && selectedStage && selectedBusArea);

  const fetchRows = useCallback(async () => {
    if (!canFetch) {
      setRows([]);
      return;
    }
    setLoading(true);
    setError(null);
    setChecked({});
    try {
      const res = await api.get("/sap/f53-data", {
        params: {
          company_id: selectedCompany,
          stage_id: selectedStage,
          business_area: selectedBusArea,
          per_page: 999,
        },
      });
      setRows(res.data?.data ?? res.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [canFetch, selectedCompany, selectedStage, selectedBusArea]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // ─────────────────────────────────────────────
  // Derived values
  // ─────────────────────────────────────────────
  const selectedRows = rows.filter((r) => checked[r.id]);
  const vendorGroups = useMemo(
    () => groupByVendor(rows, checked),
    [rows, checked],
  );
  const grandTotal = selectedRows.reduce((s, r) => s + Number(r.amount), 0);

  const activeCompany = companies.find(
    (c) => String(c.id) === String(selectedCompany),
  );
  const activeStage = stages.find(
    (s) => String(s.id) === String(selectedStage),
  );
  const activeBusArea = busAreas.find(
    (b) => String(b.id) === String(selectedBusArea),
  );

  // BKPF-BKTXT: "4050-006757"
  const headerText = activeBusArea
    ? `${activeBusArea.sap_id}-${headerSuffix}`
    : headerSuffix;

  // Stage text: pakai stage_text kalau ada, fallback ke name
  const stageText = activeStage?.stage_text ?? activeStage?.name ?? "";

  // Checkbox all
  const allChecked = rows.length > 0 && rows.every((r) => checked[r.id]);
  const someChecked = rows.some((r) => checked[r.id]);

  const toggleAll = () => {
    if (allChecked) {
      setChecked({});
    } else {
      const next: CheckedMap = {};
      rows.forEach((r) => {
        next[r.id] = true;
      });
      setChecked(next);
    }
  };

  const toggleRow = (id: number) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ─────────────────────────────────────────────
  // Validate & Generate
  // ─────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!postingDate) errs.postingDate = "Tanggal posting wajib diisi";
    if (!headerSuffix.trim()) errs.headerSuffix = "Wajib diisi";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerate = async () => {
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
      downloadF53Batch(vendorGroups, {
        sapUser: user?.sap_user ?? "",
        sapServer: user?.sap_server_con ?? "",
        companyCode: activeCompany.sap_id,
        businessArea: activeBusArea?.sap_id ?? selectedBusArea,
        bankAccount: activeCompany.accbank,
        postingDate,
        headerText,
        stageText,
      });
    } finally {
      setGenerating(false);
    }
  };

  // ─────────────────────────────────────────────
  // Options untuk Select
  // ─────────────────────────────────────────────
  const companyOptions = companies.map((c) => ({
    value: (c.id),
    label: `${c.sap_id} — ${c.name}`,
  }));

  const stageOptions = stages.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  const busAreaOptions = busAreas.map((b) => ({
    value: String(b.id),
    label: `${b.sap_id} — ${b.name}`,
  }));

  const canGenerate = selectedRows.length > 0 && postingDate && headerSuffix;

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

      {/* STEP 1: FILTER */}
      <Card variant="outlined">
        <Card.Header
          title="1. Pilih Filter Data"
          subtitle="Pilih company, stage, dan business area untuk memuat data F53"
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

      {/* STEP 2: FORM HEADER */}
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
              <div className={styles.headerTextPreview}>
                <span className={styles.headerPrefixLabel}>
                  Prefix (dari Bus Area)
                </span>
                <span className={styles.headerPrefixValue}>
                  {activeBusArea?.sap_id ?? "—"} -
                </span>
              </div>
              <Input
                label="Nomor Header (BKPF-BKTXT)"
                placeholder="006757"
                value={headerSuffix}
                onChange={(e) => setHeaderSuffix(e.target.value)}
                error={formErrors.headerSuffix}
                hint={`Hasil: ${headerText || "(belum diisi)"}`}
                maxLength={10}
              />
            </div>
          </div>

          {/* SAP field preview */}
          {(postingDate || headerSuffix) && (
            <div className={styles.sapPreview}>
              <div className={styles.sapPreviewTitle}>
                <Info size={13} />
                Preview field SAP
              </div>
              <div className={styles.sapPreviewGrid}>
                <SapField label="BKPF-BKTXT" value={headerText || "—"} />
                <SapField
                  label="BKPF-BUKRS"
                  value={activeCompany?.sap_id ?? "—"}
                />
                <SapField
                  label="BSEG-GSBER"
                  value={activeBusArea?.sap_id ?? "—"}
                />
                <SapField
                  label="RF05A-KONTO"
                  value={activeCompany?.accbank ?? "—"}
                  warn={!activeCompany?.accbank}
                />
                <SapField
                  label="RF05A-AUGTX"
                  value={stageText ? `TAG ${stageText}/[vendor]` : "—"}
                  note="per vendor"
                />
                <SapField
                  label="BSEG-WRBTR"
                  value={grandTotal > 0 ? formatRupiah(grandTotal) : "—"}
                  note="total checklist"
                />
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* STEP 3: TABEL DATA */}
      <Card variant="outlined">
        <Card.Header
          title="3. Pilih Transaksi"
          action={
            canFetch ? (
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
            ) : undefined
          }
        />

        {/* Summary bar */}
        {someChecked && (
          <div className={styles.summaryBar}>
            <div className={styles.summaryLeft}>
              <CheckSquare size={16} />
              <span>
                <strong>{selectedRows.length}</strong> transaksi dipilih
                {vendorGroups.length > 1 && (
                  <>
                    {" "}
                    · <strong>{vendorGroups.length} vendor</strong> — akan
                    generate {vendorGroups.length} file
                  </>
                )}
              </span>
            </div>
            <div className={styles.summaryRight}>
              Total: <strong>{formatRupiah(grandTotal)}</strong>
            </div>
          </div>
        )}

        {/* Vendor breakdown jika multi-vendor */}
        {vendorGroups.length > 1 && (
          <div className={styles.vendorBreakdown}>
            {vendorGroups.map((g) => (
              <div
                key={g.vendorSapId || g.vendorName}
                className={styles.vendorChip}
              >
                <span className={styles.vendorChipName}>{g.vendorName}</span>
                <span className={styles.vendorChipAmount}>
                  {formatRupiah(g.totalAmount)}
                </span>
                <span className={styles.vendorChipCount}>
                  {g.rows.length} baris
                </span>
              </div>
            ))}
          </div>
        )}

        {/* State: belum pilih filter */}
        {!canFetch && (
          <div className={styles.emptyState}>
            <Layers size={36} className={styles.emptyIcon} />
            <p>Lengkapi filter di atas untuk memuat data</p>
          </div>
        )}

        {/* State: loading */}
        {canFetch && loading && (
          <div className={styles.loadingState}>
            <Loader2 size={24} className={styles.spinning} />
            <span>Memuat data...</span>
          </div>
        )}

        {/* State: error */}
        {canFetch && !loading && error && (
          <div className={styles.errorState}>
            <AlertCircle size={18} />
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchRows}>
              Coba lagi
            </Button>
          </div>
        )}

        {/* Tabel */}
        {canFetch && !loading && !error && rows.length === 0 && (
          <div className={styles.emptyState}>
            <Info size={36} className={styles.emptyIcon} />
            <p>Tidak ada data untuk filter yang dipilih</p>
          </div>
        )}

        {canFetch && !loading && !error && rows.length > 0 && (
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
                  <th>Vendor</th>
                  <th>SAP ID</th>
                  <th>Bus Area</th>
                  <th>PO Number</th>
                  <th className={styles.thRight}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`${styles.tr} ${checked[row.id] ? styles.trSelected : ""}`}
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
                    <td className={styles.vendorName}>{row.vendor_name}</td>
                    <td className={styles.tdMono}>
                      {row.vendor_sap_id || "—"}
                    </td>
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

      {/* STEP 4: GENERATE */}
      <Card variant="outlined">
        <Card.Body>
          <div className={styles.generateSection}>
            <div>
              <div className={styles.generateTitle}>
                4. Generate Shortcut SAP
              </div>
              <div className={styles.generateDesc}>
                {canGenerate
                  ? `${vendorGroups.length} file .sap akan didownload untuk ${selectedRows.length} transaksi`
                  : "Lengkapi filter, form header, dan pilih minimal 1 transaksi"}
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              disabled={!canGenerate || generating}
              loading={generating}
              onClick={handleGenerate}
            >
              <Download size={16} />
              {generating
                ? "Generating..."
                : `Generate ${vendorGroups.length > 1 ? `(${vendorGroups.length} file)` : "Shortcut"}`}
            </Button>
          </div>

          {/* Validation hints */}
          {!canGenerate && (
            <div className={styles.hintList}>
              {!canFetch && (
                <div className={styles.hint}>
                  <AlertCircle size={13} /> Pilih Company, Stage, dan Business
                  Area
                </div>
              )}
              {canFetch && !postingDate && (
                <div className={styles.hint}>
                  <AlertCircle size={13} /> Isi Tanggal Posting
                </div>
              )}
              {canFetch && !headerSuffix && (
                <div className={styles.hint}>
                  <AlertCircle size={13} /> Isi Nomor Header
                </div>
              )}
              {canFetch &&
                postingDate &&
                headerSuffix &&
                selectedRows.length === 0 && (
                  <div className={styles.hint}>
                    <AlertCircle size={13} /> Centang minimal 1 transaksi
                  </div>
                )}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-component: preview satu field SAP
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
