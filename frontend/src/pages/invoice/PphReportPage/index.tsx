import { useState, useCallback } from "react";
import { FileText, Printer } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Alert from "../../../components/ui/Alert";
import { useToast } from "../../../components/ui/Toast";
import styles from "./ReceiptManagement.module.css";
import api from "../../../api/axios";

const PPH_OPTIONS = [
  { value: "21510001", label: "PPh Ps. 21" },
  { value: "21520001", label: "PPh Ps. 23" },
  { value: "21520002", label: "PPh Ps. 4 (2)" },
  { value: "21520003", label: "PPh Ps. 22" },
  { value: "21540001", label: "PPh Ps. 26" },
  { value: "21580001", label: "PPh Ps. 15" },
];

function formatRp(val: number) {
  return val.toLocaleString("id-ID");
}

export default function PphReportPage() {
  const { addToast } = useToast();

  // Filter state
  const [companyCode, setCompanyCode] = useState("");
  const [glAccount, setGlAccount] = useState("");
  const [month, setMonth] = useState("");

  // Data state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);

  // Inline edit state: { rowId: gl_cost_account value }
  const [editing, setEditing] = useState<Record<number, string>>({});

  const canFetch = companyCode && glAccount && month;

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
        setReport(data.data);
      } else {
        setError(data.error || "Gagal memuat data");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [companyCode, glAccount, month, canFetch]);

  // Simpan gl_cost_account — tanya konfirmasi update vendor
  const handleSaveGlCost = useCallback(
    async (row: any) => {
      const newVal = editing[row.id];
      if (newVal === undefined || newVal === row.gl_cost_account) {
        setEditing((prev) => {
          const n = { ...prev };
          delete n[row.id];
          return n;
        });
        return;
      }

      const confirm = window.confirm(
        `Update GL Cost Account "${newVal}" ke master vendor "${row.vendor_name}"?\n\nData vendor akan diperbarui sehingga import berikutnya otomatis terisi.`,
      );

      if (!confirm) return;

      try {
        await api.patch("/sap/vendor-gl-cost", {
          vendor_sap_id: row.vendor_sap_id,
          gl_cost_account: newVal,
        });

        // Update local state
        setReport((prev: any) => ({
          ...prev,
          rows: prev.rows.map((r: any) =>
            r.vendor_sap_id === row.vendor_sap_id
              ? { ...r, gl_cost_account: newVal }
              : r,
          ),
        }));

        setEditing((prev) => {
          const n = { ...prev };
          delete n[row.id];
          return n;
        });

        addToast({
          variant: "success",
          title: "GL Cost Account vendor diperbarui.",
        });
      } catch {
        addToast({ variant: "danger", title: "Gagal update GL Cost Account." });
      }
    },
    [editing, addToast],
  );

  const handleGenerateReport = useCallback(() => {
    if (!report) return;

    const rows = report.rows as any[];
    const glLabel =
      PPH_OPTIONS.find((o) => o.value === glAccount)?.label ?? glAccount;

    const rowsHtml = rows
      .map(
        (row, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${row.no_bukti_potong ?? ""}</td>
                <td>${row.gl_cost_account ?? ""}</td>
                <td>${row.tgl_faktur ?? ""}</td>
                <td>${row.no_faktur ?? ""}</td>
                <td>${row.vendor_name ?? ""}</td>
                <td>${row.npwp ?? ""}</td>
                <td>${row.address ?? ""}</td>
                <td>${row.service_type ?? ""}</td>
                <td class="num">${formatRp(row.bruto)}</td>
                <td class="num">${formatRp(row.dpp)}</td>
                <td class="num">${row.tarif}%</td>
                <td class="num">${formatRp(row.pph_dipotong)}</td>
                <td>${row.doc_number ?? ""}</td>
                <td>${row.po_text ?? ""}</td>
            </tr>
        `,
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
  .header p  { font-size: 9pt; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border: 1px solid #000; padding: 3px 5px; vertical-align: top; }
  th { background: #d9d9d9; text-align: center; font-size: 8pt; }
  td.num { text-align: right; white-space: nowrap; }
  tfoot td { font-weight: bold; background: #f0f0f0; }
  @media print {
    body { padding: 0; }
    button { display: none; }
  }
</style>
</head>
<body>
  <div class="header">
    <h2>${report.company.name}</h2>
    <p>${report.company.npwp ?? ""}</p>
    <p><strong>Daftar Pemotongan ${glLabel}</strong></p>
    <p>Masa Pajak Bulan ${report.periode}</p>
  </div>

  <div style="text-align:right; margin-bottom:8px;">
    <button onclick="window.print()">🖨️ Print / Save PDF</button>
  </div>

  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>No Bukti Potong</th>
        <th>GL Account</th>
        <th>Tgl Faktur</th>
        <th>No Faktur</th>
        <th>Nama Rekanan</th>
        <th>NPWP</th>
        <th>Alamat</th>
        <th>Jenis Pekerjaan</th>
        <th>Bruto (Rp)</th>
        <th>DPP (Rp)</th>
        <th>Tarif</th>
        <th>PPh Dipotong (Rp)</th>
        <th>Doc Number</th>
        <th>PO Text</th>
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
                    <th style={th}>No</th>
                    <th style={th}>Tgl Faktur</th>
                    <th style={th}>No Faktur</th>
                    <th style={th}>Nama Vendor</th>
                    <th style={th}>NPWP</th>
                    <th style={th}>Jenis Pekerjaan</th>
                    <th style={th}>GL Cost Account</th>
                    <th style={th}>Bruto</th>
                    <th style={th}>Tarif</th>
                    <th style={th}>PPh Dipotong</th>
                    <th style={th}>Doc Number</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row: any, i: number) => (
                    <tr
                      key={row.id}
                      style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                      <td style={td}>{i + 1}</td>
                      <td style={td}>{row.tgl_faktur}</td>
                      <td style={td}>
                        <span className={styles.code}>{row.no_faktur}</span>
                      </td>
                      <td style={td}>{row.vendor_name}</td>
                      <td style={td}>
                        <span className={styles.code}>{row.npwp}</span>
                      </td>
                      <td style={td}>{row.service_type}</td>

                      {/* Inline edit GL Cost Account */}
                      <td style={td}>
                        {editing[row.id] !== undefined ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input
                              autoFocus
                              value={editing[row.id]}
                              onChange={(e) =>
                                setEditing((prev) => ({
                                  ...prev,
                                  [row.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveGlCost(row);
                                if (e.key === "Escape")
                                  setEditing((prev) => {
                                    const n = { ...prev };
                                    delete n[row.id];
                                    return n;
                                  });
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
                              onClick={() =>
                                setEditing((prev) => {
                                  const n = { ...prev };
                                  delete n[row.id];
                                  return n;
                                })
                              }
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
                                [row.id]: row.gl_cost_account ?? "",
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

                      <td style={{ ...td, textAlign: "right" }}>
                        Rp {formatRp(row.bruto)}
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        {row.tarif}%
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        Rp {formatRp(row.pph_dipotong)}
                      </td>
                      <td style={td}>
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
                    <td colSpan={7} style={{ ...td, textAlign: "right" }}>
                      TOTAL
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      Rp {formatRp(report.total_bruto)}
                    </td>
                    <td style={td}></td>
                    <td style={{ ...td, textAlign: "right" }}>
                      Rp {formatRp(report.total_pph)}
                    </td>
                    <td style={td}></td>
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

// ── Style helpers ─────────────────────────────────────────────
const th: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "2px solid var(--border-default)",
  fontWeight: 600,
  fontSize: "var(--text-xs)",
  color: "var(--text-secondary)",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "6px 10px",
  color: "var(--text-primary)",
  verticalAlign: "top",
};

const inlineBtn = (color: string): React.CSSProperties => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  color,
  fontWeight: 700,
  fontSize: 14,
  padding: "0 2px",
});
