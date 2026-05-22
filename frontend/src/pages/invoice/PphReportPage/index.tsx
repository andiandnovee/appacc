import { useState, useCallback } from "react";
import { Printer, Download,Trash2 } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Alert from "../../../components/ui/Alert";
import { useToast } from "../../../components/ui/Toast";
import styles from "./ReceiptManagement.module.css";
import api from "../../../api/axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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


  const [deleting, setDeleting] = useState(false);

const handleDeleteData = useCallback(async () => {
  if (!canFetch) return;

  const glLabel =
    PPH_OPTIONS.find((o) => o.value === glAccount)?.label ?? glAccount;

  const confirmed = window.confirm(
    `Hapus semua data ${glLabel} untuk bulan ${month}?\n\nData yang sudah diimpor akan dihapus permanen dari database.`,
  );
  if (!confirmed) return;

  setDeleting(true);
  try {
    await api.delete("/sap/pph-data", {
      params: {
        company_code:    companyCode,
        gl_account_code: glAccount,
        month,
      },
    });
    setReport(null);
    setEditing({});
    addToast({ variant: "success", title: "Data berhasil dihapus." });
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })
      ?.response?.data?.message;
    addToast({ variant: "danger", title: msg ?? "Gagal menghapus data." });
  } finally {
    setDeleting(false);
  }
}, [canFetch, companyCode, glAccount, month, addToast]);



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

    // ── Group rows per vendor ─────────────────────────────────
    const grouped = new Map<string, PphRow[]>();
    for (const row of report.rows) {
      const key = row.vendor_sap_id;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(row);
    }

    // ── Build tbody HTML ──────────────────────────────────────
    let no = 1;
    let bodyHtml = "";

    for (const [, rows] of grouped) {
      const first = rows[0];
      const subtotalPph = rows.reduce((s, r) => s + r.pph_dipotong, 0);

      rows.forEach((row, idx) => {
        const isFirst = idx === 0;
        bodyHtml += `
    <tr>
      <td>${no++}</td>
      <td>${row.no_bukti_potong ?? ""}</td>
      <td>${row.gl_cost_account ?? ""}</td>
      <td>${row.tgl_faktur}</td>
      <td>${row.no_faktur}</td>
      <td>${row.vendor_name}</td>
      <td>${row.npwp ?? ""}</td>
      <td class="addr">${isFirst ? (row.address ?? "") : ""}</td>
      <td>${isFirst ? (row.service_type ?? "") : ""}</td>
      <td>${row.tgl_faktur}</td>
      <td class="num">${formatRp(row.bruto)}</td>
      <td class="num">${formatRp(row.dpp)}</td>
      <td class="num">${row.tarif}%</td>
      <td class="num">${formatRp(row.pph_dipotong)}</td>
      
      <td>${row.doc_number}</td>
      <td>${row.po_text ?? ""}</td>
    </tr>`;
      });

      // Baris subtotal per vendor
      bodyHtml += `
  <tr class="subtotal">
    <td colspan="5"></td>
    <td>${first.vendor_name}</td>
    <td>${first.npwp ?? ""}</td>
    <td class="addr">${first.address ?? ""}</td>
    <td colspan="5" style="text-align:right">Total</td>
    <td class="num"><strong>${formatRp(subtotalPph)}</strong></td>
    <td colspan="2"></td>
  </tr>`;
    }

    // ── Full HTML ─────────────────────────────────────────────
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan ${glLabel} - ${report.periode}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 8.5pt; color: #000; padding: 12px; }

  .header { text-align: center; margin-bottom: 12px; line-height: 1.5; }
  .header h2 { font-size: 11pt; font-weight: bold; }

  .print-btn {
    text-align: right; margin-bottom: 8px;
  }
  .print-btn button {
    padding: 4px 12px; font-size: 9pt; cursor: pointer;
    background: #1d4ed8; color: #fff; border: none; border-radius: 4px;
  }

  table { width: 100%; border-collapse: collapse; font-size: 7.5pt;table-layout: fixed;  }

  /* Header tabel — dua baris seperti template Excel */
  thead tr th {
    background: #d9d9d9;
    border: 1px solid #000;
    padding: 3px 4px;
    text-align: center;
    vertical-align: middle;
    font-size: 7.5pt;
  }

  tbody td {
    border: 1px solid #000;
    padding: 2px 4px;
    vertical-align: top;
  }
  td.num { text-align: right; white-space: nowrap; }
  td.addr { font-size: 6.5pt; max-width: 120px; word-break: break-word; }

  /* Baris subtotal per vendor */
  tr.subtotal td {
    background: #fffbe6;
    border: 1px solid #000;
    padding: 2px 4px;
    font-size: 7pt;
  }

  tfoot td {
    border: 1px solid #000;
    padding: 3px 4px;
    font-weight: bold;
    background: #f0f0f0;
  }

  @media print {
    body { padding: 0; font-size: 7.5pt; }
    .print-btn { display: none; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; }
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

  <div class="print-btn">
    <button onclick="window.print()">🖨️ Print / Save PDF</button>
  </div>

  <table>
  
    <thead>
    
    
<colgroup>
  <col style="width:3%">   <!-- No -->
  <col style="width:7%">   <!-- No Bukti Potong -->
  <col style="width:5%">   <!-- GL Account -->
  <col style="width:6%">   <!-- Tgl Faktur -->
  <col style="width:9%">   <!-- No Faktur -->
  <col style="width:9%">   <!-- Nama -->
  <col style="width:8%">   <!-- NPWP -->
  <col style="width:10%">  <!-- Alamat -->
  <col style="width:7%">   <!-- Jenis Pekerjaan -->
  <col style="width:6%">   <!-- Tanggal -->
  <col style="width:6%">   <!-- Bruto -->
  <col style="width:6%">   <!-- DPP -->
  <col style="width:4%">   <!-- Tarif -->
  <col style="width:6%">   <!-- PPh Dipotong -->
  <col style="width:6%">   <!-- Total PPh -->
  <col style="width:6%">   <!-- Doc Number -->
  <col style="width:6%">   <!-- PO Text -->
</colgroup>
      <!-- Baris header 1 -->
      <tr>
        <th rowspan="3">No</th>
        <th rowspan="3">No Bukti<br>Potong</th>
        <th rowspan="3">GL<br>Account</th>
        <th rowspan="3">Tgl Faktur<br>Pajak/Invoice</th>
        <th rowspan="3">No. Faktur<br>Pajak/Invoice</th>
        <th colspan="4">Identitas Rekanan</th>
        <th colspan="5">Dokumen Tagihan</th>
    
        <th rowspan="3">Doc Number<br>(SAP)</th>
        <th rowspan="3">PO Text</th>
      </tr>
      <!-- Baris header 2 -->
      <tr>
        <th rowspan="2">Nama</th>
        <th rowspan="2">NPWP</th>
        <th rowspan="2">Alamat</th>
        <th rowspan="2">Jenis Pekerjaan<br>Yang Dilakukan</th>
        <th rowspan="2">Tanggal</th>
        <th rowspan="2">Bruto (Rp)</th>
        <th rowspan="2">DPP (Rp)</th>
        <th rowspan="2">Tarif<br>PPh (%)</th>
        <th rowspan="2">PPh yang<br>Dipotong (Rp)</th>
      </tr>
      <!-- Baris header 3 — kosong karena semua rowspan -->
      <tr></tr>
    </thead>
    <tbody>${bodyHtml}</tbody>
    <tfoot>
      <tr>
        <td colspan="9" style="text-align:right">T O T A L</td>
        <td class="num">${formatRp(report.total_bruto)}</td>
        <td class="num">${formatRp(report.total_bruto)}</td>
        <td></td>
        <td class="num">${formatRp(report.total_pph)}</td>
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

  const handleExportExcel = useCallback(async () => {
    if (!report) return;

    const glLabel =
      PPH_OPTIONS.find((o) => o.value === glAccount)?.label ?? glAccount;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Laporan PPh");

    const COLS = 17; // A–Q

    // ── Helper styles ─────────────────────────────────────────
    const borderAll: Partial<ExcelJS.Borders> = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    const fillGrey: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    const fillYellow: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFBE6" },
    };
    const fillFooter: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF0F0F0" },
    };

    const alignCenter: Partial<ExcelJS.Alignment> = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    const alignRight: Partial<ExcelJS.Alignment> = {
      horizontal: "right",
      vertical: "middle",
    };
    const alignLeft: Partial<ExcelJS.Alignment> = {
      horizontal: "left",
      vertical: "middle",
      wrapText: false,
    };

    const fmtNumber = "#,##0";
    const fmtPct = '0.00"%"';

    // ── Helper: merge + set value + style ────────────────────
    const mergeCenter = (
      rowNum: number,
      value: string,
      bold = false,
      fontSize = 10,
    ) => {
      ws.mergeCells(rowNum, 1, rowNum, COLS);
      const cell = ws.getCell(rowNum, 1);
      cell.value = value;
      //cell.alignment = a;
      cell.font = { bold, size: fontSize };
    };

    const applyRowStyle = (
      row: ExcelJS.Row,
      fill: ExcelJS.Fill,
      bold = false,
      colCount = COLS,
    ) => {
      for (let c = 1; c <= colCount; c++) {
        const cell = row.getCell(c);
        cell.fill = fill;
        cell.border = borderAll;
        cell.font = { bold, size: 8 };
      }
    };

    // ── Set column widths ─────────────────────────────────────
    ws.columns = [
      { width: 4 }, // A  No
      { width: 14 }, // B  No Bukti Potong
      { width: 10 }, // C  GL Account
      { width: 12 }, // D  Tgl Faktur
      { width: 22 }, // E  No Faktur
      { width: 28 }, // F  Nama
      { width: 20 }, // G  NPWP
      { width: 36 }, // H  Alamat
      { width: 18 }, // I  Jenis Pekerjaan
      { width: 12 }, // J  Tanggal
      { width: 14 }, // K  Bruto
      { width: 14 }, // L  DPP
      { width: 8 }, // M  Tarif
      { width: 16 }, // N  PPh Dipotong
      { width: 16 }, // O  Total PPh
      { width: 14 }, // P  Doc Number
      { width: 30 }, // Q  PO Text
    ];

    // ── Baris 1–4: Header perusahaan ─────────────────────────
    mergeCenter(1, report.company.name, true, 12);
    mergeCenter(2, report.company.npwp ?? "", false, 10);
    mergeCenter(3, `Daftar Pemotongan ${glLabel}`, true, 11);
    mergeCenter(4, `Masa Pajak Bulan ${report.periode}`, false, 10);

    ws.addRow([]); // baris 5 kosong

    // ── Baris 6–8: Header kolom (3 baris merge) ──────────────
    // Baris 6
    const h1 = ws.getRow(6);
    h1.height = 28;

    // Kolom yang rowspan=3 (merge baris 6–8)
    const spanCols: [number, string][] = [
      [1, "No"],
      [2, "No Bukti\nPotong"],
      [3, "GL\nAccount"],
      [4, "Tgl Faktur\nPajak/Invoice"],
      [5, "No. Faktur\nPajak/Invoice"],
      [16, "Doc Number\n(SAP)"],
      [17, "PO Text"],
    ];
    spanCols.forEach(([c, label]) => {
      ws.mergeCells(6, c, 8, c);
      const cell = ws.getCell(6, c);
      cell.value = label;
      cell.alignment = alignCenter;
      cell.fill = fillGrey;
      cell.border = borderAll;
      cell.font = { bold: true, size: 8 };
    });

    // Grup "Identitas Rekanan" (F–I = col 6–9), merge baris 6
    ws.mergeCells(6, 6, 6, 9);
    const idRek = ws.getCell(6, 6);
    idRek.value = "Identitas Rekanan";
    idRek.alignment = alignCenter;
    idRek.fill = fillGrey;
    idRek.border = borderAll;
    idRek.font = { bold: true, size: 8 };

    // Grup "Dokumen Tagihan" (J–O = col 10–15), merge baris 6
    ws.mergeCells(6, 10, 6, 15);
    const dokTag = ws.getCell(6, 10);
    dokTag.value = "Dokumen Tagihan";
    dokTag.alignment = alignCenter;
    dokTag.fill = fillGrey;
    dokTag.border = borderAll;
    dokTag.font = { bold: true, size: 8 };

    // Baris 7 — sub-header Identitas Rekanan + Dokumen Tagihan
    const h2 = ws.getRow(7);
    h2.height = 28;

    const identitasCols: [number, string][] = [
      [6, "Nama"],
      [7, "NPWP"],
      [8, "Alamat"],
      [9, "Jenis Pekerjaan\nYang Dilakukan"],
    ];
    identitasCols.forEach(([c, label]) => {
      ws.mergeCells(7, c, 8, c); // rowspan 2
      const cell = ws.getCell(7, c);
      cell.value = label;
      cell.alignment = alignCenter;
      cell.fill = fillGrey;
      cell.border = borderAll;
      cell.font = { bold: true, size: 8 };
    });

    const dokumenCols: [number, string][] = [
      [10, "Tanggal"],
      [11, "Bruto\n(Rp)"],
      [12, "DPP\n(Rp)"],
      [13, "Tarif\nPPh (%)"],
      [14, "PPh yang\nDipotong (Rp)"],
      [15, "Total PPh\nDipotong (Rp)"],
    ];
    dokumenCols.forEach(([c, label]) => {
      ws.mergeCells(7, c, 8, c); // rowspan 2
      const cell = ws.getCell(7, c);
      cell.value = label;
      cell.alignment = alignCenter;
      cell.fill = fillGrey;
      cell.border = borderAll;
      cell.font = { bold: true, size: 8 };
    });

    // Baris 8 — kosong (sudah di-merge semua)
    ws.getRow(8).height = 5;

    // ── Data rows ─────────────────────────────────────────────
    const grouped = new Map<string, PphRow[]>();
    for (const row of report.rows) {
      if (!grouped.has(row.vendor_sap_id)) grouped.set(row.vendor_sap_id, []);
      grouped.get(row.vendor_sap_id)!.push(row);
    }

    let no = 1;

    for (const [, rows] of grouped) {
      const first = rows[0];
      const subtotalPph = rows.reduce((s, r) => s + r.pph_dipotong, 0);

      rows.forEach((row, idx) => {
        const isFirst = idx === 0;
        const r = ws.addRow([
          no++,
          row.no_bukti_potong ?? "",
          row.gl_cost_account ?? "",
          row.tgl_faktur,
          row.no_faktur,
          row.vendor_name,
          row.npwp ?? "",
          isFirst ? (row.address ?? "") : "",
          isFirst ? (row.service_type ?? "") : "",
          row.tgl_faktur,
          row.bruto,
          row.dpp,
          row.tarif,
          row.pph_dipotong,
          "", // Total PPh — kosong di baris data
          row.doc_number,
          row.po_text ?? "",
        ]);
        r.height = 18;

        for (let c = 1; c <= COLS; c++) {
          const cell = r.getCell(c);
          cell.border = borderAll;
          cell.font = { size: 8 };
          cell.alignment = alignLeft;

          // Kolom angka
          if ([11, 12, 14].includes(c)) {
            cell.numFmt = fmtNumber;
            cell.alignment = alignRight;
          }
          // Kolom tarif
          if (c === 13) {
            cell.numFmt = fmtPct;
            cell.alignment = alignRight;
          }
        }
      });

      // Baris subtotal per vendor
      const sub = ws.addRow([
        "",
        "",
        "",
        "",
        "",
        first.vendor_name,
        first.npwp ?? "",
        first.address ?? "",
        "",
        "",
        "",
        "",
        "",
        "",
        subtotalPph,
        "",
        "",
      ]);
      sub.height = 16;
      for (let c = 1; c <= COLS; c++) {
        const cell = sub.getCell(c);
        cell.fill = fillYellow;
        cell.border = borderAll;
        cell.font = { bold: true, size: 8 };
        cell.alignment = alignLeft;
        if (c === 15) {
          cell.numFmt = fmtNumber;
          cell.alignment = alignRight;
        }
      }
    }

    // ── Baris TOTAL footer ────────────────────────────────────
    const tot = ws.addRow([
      "T O T A L",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      report.total_bruto,
      report.total_bruto,
      "",
      report.total_pph,
      report.total_pph,
      "",
      "",
    ]);
    tot.height = 18;
    for (let c = 1; c <= COLS; c++) {
      const cell = tot.getCell(c);
      cell.fill = fillFooter;
      cell.border = borderAll;
      cell.font = { bold: true, size: 8 };
      cell.alignment = c === 1 ? alignRight : alignLeft;
      if ([11, 12, 14, 15].includes(c)) {
        cell.numFmt = fmtNumber;
        cell.alignment = alignRight;
      }
    }
    // Merge "T O T A L" label (A–J)
    ws.mergeCells(tot.number, 1, tot.number, 10);

    // ── Save ──────────────────────────────────────────────────
    const buf = await wb.xlsx.writeBuffer();
    const fileName = `Laporan_${glLabel.replace(/\s/g, "_")}_${report.company.name.replace(/\s/g, "_")}_${report.periode.replace(/\s/g, "_")}.xlsx`;
    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      fileName,
    );
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
                onChange={(e) => setCompanyCode(String(e.target.value))}
                placeholder="Pilih Perusahaan"
                fetchOptions={{
                  endpoint: "/companies/select-options",
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
               <Button
    variant="danger"
    iconLeft={<Trash2 size={15} />}
    onClick={handleDeleteData}
    loading={deleting}
    disabled={!canFetch || loading || deleting}
  >
    Hapus Data
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
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button
                  variant="outline"
                  iconLeft={<Download size={15} />}
                  onClick={handleExportExcel}
                >
                  Export Excel
                </Button>
                <Button
                  variant="primary"
                  iconLeft={<Printer size={15} />}
                  onClick={handleGenerateReport}
                >
                  Generate Laporan
                </Button>
              </div>
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
