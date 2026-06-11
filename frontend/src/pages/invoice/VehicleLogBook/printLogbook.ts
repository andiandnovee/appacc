// printLogbook.ts
// Path: frontend/src/pages/vehicles/printLogbook.ts
//
// Helper untuk generate HTML print "Pembebanan Kendaraan ke Unit/Dept"
// Dipakai oleh LogbookSummarySection (tombol Print & Print Semua)

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface PrintDetailRow {
  start_km: number;
  end_km: number;
  km: number;
  cost_center: string | null;
  cost_center_name: string | null;
  customer_code: string | null;
  customer_name: string | null;
  description: string;
  cost_amount: number;
}

export interface PrintHeader {
  periode: string;
  tgl_awal: string;
  tgl_akhir: string;
  start_km: number | null;
  end_km: number | null;
  total_km: number;
  total_cost: number;
  rate: number;
  alokasi: string;
  no_voucher: string;
}

export interface PrintVehicle {
  plate_number: string;
  description: string;
  cost_center: string;
}

export interface PrintPayload {
  vehicle: PrintVehicle;
  header: PrintHeader;
  details: PrintDetailRow[];
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatNumber(val: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    Math.round(val),
  );
}

function formatRate(val: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    Math.round(val),
  );
}

function formatDate(val: string): string {
  // val: "2026-05-01" -> "2026-05-01" (sesuai contoh, format ISO ditampilkan apa adanya)
  return val;
}

function periodeLabel(periode: string): string {
  // "5-2026" -> "5-2026" (sesuai contoh)
  const [m, y] = periode.split("-");
  return `${m}-${y}`;
}

// ─────────────────────────────────────────────
// SHARED CSS
// ─────────────────────────────────────────────
const PRINT_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; padding: 16px; }
  .page { page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  .title { font-weight: bold; font-size: 11pt; margin-bottom: 8px; }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 24px;
    margin-bottom: 10px;
  }
  .info-row {
    display: grid;
    grid-template-columns: 90px 12px 1fr;
    font-size: 9pt;
    line-height: 1.5;
  }
  .info-row.right {
    grid-template-columns: 100px 12px 1fr;
  }
  .info-label { font-weight: bold; }
  .info-colon { text-align: center; }
  table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 6px; }
  thead tr th {
    background: #d9e1f2;
    border: 1px solid #000;
    padding: 4px 6px;
    text-align: center;
    font-size: 8.5pt;
    font-weight: bold;
  }
  tbody td, tfoot td {
    border: 1px solid #000;
    padding: 3px 6px;
    vertical-align: top;
  }
  td.num { text-align: right; white-space: nowrap; }
  td.center { text-align: center; }
  tfoot td { font-weight: bold; background: #f2f2f2; }
  .print-btn { text-align: right; margin-bottom: 10px; }
  .print-btn button {
    padding: 6px 16px; font-size: 9pt; cursor: pointer;
    background: #1d4ed8; color: #fff; border: none; border-radius: 4px;
  }
  @media print {
    body { padding: 0; }
    .print-btn { display: none; }
  }
`;

// ─────────────────────────────────────────────
// Build satu halaman (tabel) untuk satu kendaraan
// ─────────────────────────────────────────────
function buildVehiclePage(payload: PrintPayload, no: number): string {
  const { vehicle, header, details } = payload;

  let rows = "";
  details.forEach((d, i) => {
    const beban = d.cost_center
      ? d.cost_center_name ?? d.cost_center
      : d.customer_name ?? d.customer_code ?? "";
    const ccCust = d.cost_center ?? d.customer_code ?? "";

    rows += `
    <tr>
      <td class="center">${i + 1}</td>
      <td>${formatNumber(d.start_km)}-${formatNumber(d.end_km)}</td>
      <td>${beban}</td>
      <td class="center">${ccCust}</td>
      <td class="num">${formatNumber(d.km)}</td>
      <td class="num">${formatNumber(d.cost_amount)}</td>
      <td>${d.description}</td>
    </tr>`;
  });

  return `
  <div class="page">
    <div class="title">PEMBEBANAN KENDARAAN KE UNIT/DEPT</div>
    <div class="info-grid">
      <div>
        <div class="info-row">
          <span class="info-label">NO POLISI</span><span class="info-colon">:</span><span>${vehicle.plate_number}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Kendaraan</span><span class="info-colon">:</span><span>${vehicle.description}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Cost Center</span><span class="info-colon">:</span><span>${vehicle.cost_center}</span>
        </div>
        <div class="info-row">
          <span class="info-label">PERIODE</span><span class="info-colon">:</span><span>${periodeLabel(header.periode)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Tgl Awal</span><span class="info-colon">:</span><span>${formatDate(header.tgl_awal)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Tgl Akhir</span><span class="info-colon">:</span><span>${formatDate(header.tgl_akhir)}</span>
        </div>
      </div>
      <div>
        <div class="info-row right">
          <span class="info-label">Alokasi</span><span class="info-colon">:</span><span>${header.alokasi}</span>
        </div>
        <div class="info-row right">
          <span class="info-label">No Voucher</span><span class="info-colon">:</span><span>${header.no_voucher}</span>
        </div>
        <div class="info-row right">
          <span class="info-label">KM Awal</span><span class="info-colon">:</span><span>${formatNumber(header.start_km ?? 0)}</span>
        </div>
        <div class="info-row right">
          <span class="info-label">KM Akhir</span><span class="info-colon">:</span><span>${formatNumber(header.end_km ?? 0)}</span>
        </div>
        <div class="info-row right">
          <span class="info-label">Total KM</span><span class="info-colon">:</span><span>${formatNumber(header.total_km)}</span>
        </div>
        <div class="info-row right">
          <span class="info-label">Total Biaya</span><span class="info-colon">:</span><span>${formatNumber(header.total_cost)}</span>
        </div>
        <div class="info-row right">
          <span class="info-label">RATE</span><span class="info-colon">:</span><span>${formatRate(header.rate)}</span>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:32px">NO</th>
          <th style="width:120px">Log KM</th>
          <th>BEBAN</th>
          <th style="width:90px">CC/CUST</th>
          <th style="width:60px">KM</th>
          <th style="width:90px">RP</th>
          <th>KETERANGAN</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="4" class="center">${no}</td>
          <td class="num">${formatNumber(header.total_km)}</td>
          <td class="num">${formatNumber(header.total_cost)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>`;
}

// ─────────────────────────────────────────────
// Open print window — satu kendaraan
// ─────────────────────────────────────────────
export function openPrintSingle(payload: PrintPayload): void {
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Pembebanan ${payload.vehicle.plate_number} - ${payload.header.periode}</title>
<style>${PRINT_CSS}</style>
</head>
<body>
  <div class="print-btn"><button onclick="window.print()">🖨️ Print / Save PDF</button></div>
  ${buildVehiclePage(payload, 1)}
</body>
</html>`;

  const win = window.open("", "_blank");
  win?.document.write(html);
  win?.document.close();
}

// ─────────────────────────────────────────────
// Open print window — semua kendaraan (multi-page)
// ─────────────────────────────────────────────
export function openPrintAll(payloads: PrintPayload[]): void {
  if (payloads.length === 0) return;

  const pages = payloads
    .map((p, i) => buildVehiclePage(p, i + 1))
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Pembebanan Kendaraan - ${payloads[0].header.periode}</title>
<style>${PRINT_CSS}</style>
</head>
<body>
  <div class="print-btn"><button onclick="window.print()">🖨️ Print / Save PDF (${payloads.length} kendaraan)</button></div>
  ${pages}
</body>
</html>`;

  const win = window.open("", "_blank");
  win?.document.write(html);
  win?.document.close();
}