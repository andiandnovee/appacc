import { useState, useCallback } from "react";
import { Printer } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Alert from "../../../components/ui/Alert";
import { useToast } from "../../../components/ui/Toast";
import styles from "./ReceiptManagement.module.css";
import api from "../../../api/axios";

// ── Types ─────────────────────────────────────────────────────
interface PphRow {
  id: number;
  no_bukti_potong: string | null;
  gl_account: string;
  gl_cost_account: string | null;
  tgl_faktur: string;
  no_faktur: string;
  vendor_name: string;
  vendor_sap_id: string;
  npwp: string | null;
  address: string | null;
  service_type: string | null;
  doc_number: string;
  po_text: string | null;
  bruto: number;
  dpp: number;
  tarif: number;
  pph_dipotong: number;
  pph_type: string;
}

interface PphReport {
  company: { name: string; npwp: string | null; address: string | null };
  periode: string;
  pph_type: string;
  total_pph: number;
  total_bruto: number;
  rows: PphRow[];
}

// ── Constants ─────────────────────────────────────────────────
const PPH_OPTIONS = [
  { value: "21510001", label: "PPh Ps. 21" },
  { value: "21520001", label: "PPh Ps. 23" },
  { value: "21520002", label: "PPh Ps. 4 (2)" },
  { value: "21520003", label: "PPh Ps. 22" },
  { value: "21540001", label: "PPh Ps. 26" },
  { value: "21580001", label: "PPh Ps. 15" },
];

function formatRp(val: number): string {
  return val.toLocaleString("id-ID");
}

// ── Style helpers ─────────────────────────────────────────────
const thStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "2px solid var(--border-default)",
  fontWeight: 600,
  fontSize: "var(--text-xs)",
  color: "var(--text-secondary)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "6px 10px",
  color: "var(--text-primary)",
  verticalAlign: "top",
};

function inlineBtn(color: string): React.CSSProperties {
  return {
    background: "none",
    border: "none",
    cursor: "pointer",
    color,
    fontWeight: 700,
    fontSize: 14,
    padding: "0 2px",
  };
}

// ── Component ─────────────────────────────────────────────────
export default function PphReportPage() {
  const { addToast } = useToast();

  const [companyCode, setCompanyCode] = useState("");
  const [glAccount, setGlAccount] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<PphReport | null>(null);

  // key: row.id (number) → edited value
  const [editing, setEditing] = useState<Record<string, string>>({});

  const canFetch = Boolean(companyCode && glAccount && month);

  const fetchData = useCallback(async () => {
    if (!canFetch) return;
    setLoading(true);
    setError(null);
    setReport(null);
    setEditing({});
    try {
      const { data } = await api.get("/sap/pph-data", {
        params: {
          company_code: companyCode,
          gl_account_code: glAccount,
          month,
        },
      });
      if (data.success) {
        setReport(data.data as PphReport);
      } else {
        setError((data.error as string) || "Gagal memuat data");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [companyCode, glAccount, month, canFetch]);

  const removeEditing = useCallback((id: number) => {
    setEditing((prev) => {
      const next = { ...prev };
      delete next[String(id)];
      return next;
    });
  }, []);

  const handleSaveGlCost = useCallback(
    async (row: PphRow) => {
      const newVal = editing[String(row.id)];
      if (newVal === undefined || newVal === row.gl_cost_account) {
        removeEditing(row.id);
        return;
      }

      const confirmed = window.confirm(
        `Update GL Cost Account "${newVal}" ke master vendor "${row.vendor_name}"?\n\nData vendor akan diperbarui sehingga import berikutnya otomatis terisi.`,
      );
      if (!confirmed) return;

      try {
        await api.patch("/sap/vendor-gl-cost", {
          vendor_sap_id: row.vendor_sap_id,
          gl_cost_account: newVal,
        });

        setReport((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            rows: prev.rows.map((r) =>
              r.vendor_sap_id === row.vendor_sap_id
                ? { ...r, gl_cost_account: newVal }
                : r,
            ),
          };
        });

        removeEditing(row.id);
        addToast({
          variant: "success",
          title: "GL Cost Account vendor diperbarui.",
        });
      } catch {
        addToast({ variant: "danger", title: "Gagal update GL Cost Account." });
      }
    },
    [editing, addToast, removeEditing],
  );

  const handleGenerateReport = useCallback(() => {
    if (!report) return;

    const glLabel =
      PPH_OPTIONS.find((o) => o.value === glAccount)?.label ?? glAccount;

    const rowsHtml = report.rows
      .map(
        (row, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${row.no_bukti_potong ?? ""}</td>
          <td>${row.gl_cost_account ?? ""}</td>
          <td>${row.tgl_faktur}</td>
          <td>${row.no_faktur}</td>
          <td>${row.vendor_name}</td>
          <td>${row.npwp ?? ""}</td>
          <td>${row.address ?? ""}</td>
          <td>${row.service_type ?? ""}</td>
          <td class="num">${formatRp(row.bruto)}</td>
          <td class="num">${formatRp(row.dpp)}</td>
          <td class="num">${row.tarif}%</td>
          <td class="num">${formatRp(row.pph_dipotong)}</td>
          <td>${row.doc_number}</td>
          <td>${row.po_text ?? ""}</td>
        </tr>`,
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan PPh ${glLabel} - ${report.periode}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; padding: 16px; }
  .header { text-align: center; margin-bottom: 16px; }
  .header h2 { font-size: 11pt; font-weight: bold; }
  .header p { font-size: 9pt; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border: 1px solid #000; padding: 3px 5px; vertical-align: top; }
  th { background: #d9d9d9; text-align: center; font-size: 8pt; }
  td.num { text-align: right; white-space: nowrap; }
  tfoot td { font-weight: bold; background: #f0f0f0; }
  @media print { body { padding: 0; } button { display: none; } }
</style>
</head>
<body>
  <div class="header">
    <h2>${report.company.name}</h2>
    <p>${report.company.npwp ?? ""}</p>
    <p><strong>Daftar Pemotongan ${glLabel}</strong></p>
    <p>Masa Pajak Bulan ${report.periode}</p>
  </div>
  <div style="text-align:right;margin-bottom:8px;">
    <button onclick="window.print()">🖨️ Print / Save PDF</button>
  </div>
  <table>
    <thead>
      <tr>
        <th>No</th><th>No Bukti Potong</th><th>GL Account</th>
        <th>Tgl Faktur</th><th>No Faktur</th><th>Nama Rekanan</th>
        <th>NPWP</th><th>Alamat</th><th>Jenis Pekerjaan</th>
        <th>Bruto (Rp)</th><th>DPP (Rp)</th><th>Tarif</th>
        <th>PPh Dipotong (Rp)</th><th>Doc Number</th><th>PO Text</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
    <tfoot>
      <tr>
        <td colspan="9" style="text-align:right">TOTAL</td>
        <td class="num">${formatRp(report.total_bruto)}</td>
        <td class="num">${formatRp(report.total_bruto)}</td>
        <td></td>
        <td class="num">${formatRp(report.total_pph)}</td>
        <td colspan="2"></td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;

    const win = window.open("", "_blank");
    win?.document.write(html);
    win?.document.close();
  }, [report, glAccount]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Laporan PPh</h1>
          <p className={styles.pageSubtitle}>
            Filter data, lengkapi GL Cost Account, lalu generate laporan
          </p>
        </div>
      </div>

      {/* Filter */}
      <Card variant="outlined">
        <Card.Header title="Filter Data" />
        <Card.Body>
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <label>Perusahaan</label>
              <Select
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                placeholder="Pilih Perusahaan"
                fetchOptions={{
                  endpoint: "/sap/pph-companies",
                  searchParam: "search",
                  limit: 20,
                }}
              />
            </div>
            <div className={styles.filterGroup}>
              <label>Jenis PPh</label>
              <Select
                value={glAccount}
                onChange={(e) => setGlAccount(e.target.value)}
                placeholder="Pilih Jenis PPh"
                options={PPH_OPTIONS}
              />
            </div>
            <div className={styles.filterGroup}>
              <label>Bulan</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={styles.yearInput}
              />
            </div>
            <div className={styles.filterActions}>
              <Button
                variant="primary"
                onClick={fetchData}
                loading={loading}
                disabled={!canFetch || loading}
              >
                Tampilkan Data
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {error && (
        <Alert
          variant="danger"
          description={error}
          dismissible
          onDismiss={() => setError(null)}
        />
      )}

      {/* Tabel preview */}
      {report && (
        <Card variant="outlined">
          <Card.Header
            title={`${report.pph_type} — ${report.company.name} — ${report.periode}`}
            action={
              <Button
                variant="primary"
                iconLeft={<Printer size={15} />}
                onClick={handleGenerateReport}
              >
                Generate Laporan
              </Button>
            }
          />
          <Card.Body>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "var(--text-sm)",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "var(--bg-surface-2)",
                      textAlign: "left",
                    }}
                  >
                    <th style={thStyle}>No</th>
                    <th style={thStyle}>Tgl Faktur</th>
                    <th style={thStyle}>No Faktur</th>
                    <th style={thStyle}>Nama Vendor</th>
                    <th style={thStyle}>NPWP</th>
                    <th style={thStyle}>Jenis Pekerjaan</th>
                    <th style={thStyle}>GL Cost Account</th>
                    <th style={thStyle}>Bruto</th>
                    <th style={thStyle}>Tarif</th>
                    <th style={thStyle}>PPh Dipotong</th>
                    <th style={thStyle}>Doc Number</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row, i) => (
                    <tr
                      key={row.id}
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={tdStyle}>{row.tgl_faktur}</td>
                      <td style={tdStyle}>
                        <span className={styles.code}>{row.no_faktur}</span>
                      </td>
                      <td style={tdStyle}>{row.vendor_name}</td>
                      <td style={tdStyle}>
                        <span className={styles.code}>{row.npwp}</span>
                      </td>
                      <td style={tdStyle}>{row.service_type}</td>

                      {/* Inline edit GL Cost Account */}
                      <td style={tdStyle}>
                        {editing[String(row.id)] !== undefined ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input
                              autoFocus
                              value={editing[String(row.id)]}
                              onChange={(e) =>
                                setEditing((prev) => ({
                                  ...prev,
                                  [String(row.id)]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveGlCost(row);
                                if (e.key === "Escape") removeEditing(row.id);
                              }}
                              style={{
                                width: 120,
                                padding: "2px 6px",
                                border: "1px solid var(--border-focus)",
                                borderRadius: "var(--radius-sm)",
                                fontSize: "var(--text-xs)",
                                fontFamily: "var(--font-mono)",
                              }}
                            />
                            <button
                              onClick={() => handleSaveGlCost(row)}
                              style={inlineBtn("#22c55e")}
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => removeEditing(row.id)}
                              style={inlineBtn("#ef4444")}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() =>
                              setEditing((prev) => ({
                                ...prev,
                                [String(row.id)]: row.gl_cost_account ?? "",
                              }))
                            }
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title="Klik untuk edit"
                          >
                            {row.gl_cost_account ? (
                              <span className={styles.code}>
                                {row.gl_cost_account}
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "var(--color-warning)",
                                  fontSize: "var(--text-xs)",
                                }}
                              >
                                — klik untuk isi
                              </span>
                            )}
                          </span>
                        )}
                      </td>

                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        Rp {formatRp(row.bruto)}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {row.tarif}%
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        Rp {formatRp(row.pph_dipotong)}
                      </td>
                      <td style={tdStyle}>
                        <span className={styles.code}>{row.doc_number}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr
                    style={{
                      background: "var(--bg-surface-2)",
                      fontWeight: 600,
                    }}
                  >
                    <td colSpan={7} style={{ ...tdStyle, textAlign: "right" }}>
                      TOTAL
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      Rp {formatRp(report.total_bruto)}
                    </td>
                    <td style={tdStyle}></td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      Rp {formatRp(report.total_pph)}
                    </td>
                    <td style={tdStyle}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
