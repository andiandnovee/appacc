import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ZF0002_HEADERS } from "../VehicleLogBook/ExportZF0002";
import type { DebetNotaRow } from "../../../stores/debetNotaDraft";

type ZfCell = string | number | null;
type ZfRow = ZfCell[];

const MONTH_NAMES = [
  "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
  "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER",
];

function formatDateSAP(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

function buildHeaderText(row: DebetNotaRow): string {
  const periodNumber = Number.parseInt(row.period, 10);
  const monthName = MONTH_NAMES[periodNumber - 1] ?? row.period;
  return `CTT DN ${row.senderBusinessArea} ${monthName} ${row.fiscalYear}`;
}

function buildReference(row: DebetNotaRow): string {
  return `${row.senderCompanyCode}${row.senderDocument}`;
}

function makeRow(fields: {
  dc: "D" | "C";
  companyCode: string;
  postingDate: string;
  period: string;
  documentDate: string;
  glAccount: string | null;
  vendorAccount: string | null;
  amount: number;
  businessArea: string;
  costCenter: string | null;
  assignment: string;
  text: string;
  taxCode: string;
  reference: string;
  headerText: string;
}): ZfRow {
  return [
    1,
    Number(fields.companyCode),
    formatDateSAP(fields.postingDate),
    fields.period,
    formatDateSAP(fields.documentDate),
    "YA",
    "IDR",
    null,
    fields.reference,
    fields.headerText,
    fields.dc,
    fields.glAccount ? Number(fields.glAccount) : null,
    fields.vendorAccount ? Number(fields.vendorAccount) : null,
    null,
    null,
    Math.round(fields.amount),
    Number(fields.businessArea),
    fields.costCenter ? Number(fields.costCenter) : null,
    null,
    null,
    fields.assignment,
    fields.text,
    fields.taxCode,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
}

export function buildDebetNotaZf0002Rows(rows: DebetNotaRow[], date: string): ZfRow[] {
  const first = rows[0];
  if (!first) throw new Error("Tidak ada baris Debet Nota untuk diekspor.");
  const headerText = buildHeaderText(first);
  const assignment = `CTT DN ${first.senderBusinessArea}`;
  const postingDate = date;
  const documentDate = date;

  const debitRows = rows.map((row) => makeRow({
    dc: "D",
    companyCode: row.receiverCompanyCode,
    postingDate,
    period: row.period,
    documentDate,
    glAccount: row.glAccountCode,
    vendorAccount: null,
    amount: row.amount,
    businessArea: row.receiverBusinessArea,
    costCenter: row.costCenterCode,
    assignment,
    text: row.description,
    taxCode: "I0",
    reference: buildReference(row),
    headerText,
  }));

  const creditRow = makeRow({
    dc: "C",
    companyCode: first.receiverCompanyCode,
    postingDate,
    period: first.period,
    documentDate,
    glAccount: null,
    vendorAccount: first.senderVendorCode,
    amount: rows.reduce((sum, row) => sum + row.amount, 0),
    businessArea: first.receiverBusinessArea,
    costCenter: null,
    assignment,
    text: headerText,
    taxCode: "**",
    reference: buildReference(first),
    headerText,
  });

  return [...debitRows, creditRow];
}

function buildFileBaseName(rows: DebetNotaRow[]): string {
  const first = rows[0];
  return `upload_ZF0002_DEBET_NOTA_${first?.receiverCompanyCode || "COMPANY"}_${first?.period || "PERIOD"}_${first?.fiscalYear || "YEAR"}`;
}

export async function exportDebetNotaExcel(rows: DebetNotaRow[], date: string): Promise<void> {
  const zfRows = buildDebetNotaZf0002Rows(rows, date);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.addRow(ZF0002_HEADERS);
  worksheet.getRow(1).font = { bold: true };
  zfRows.forEach((row) => worksheet.addRow(row));
  worksheet.columns.forEach((column, index) => {
    column.width = [9, 10, 14, 22].includes(index + 1) ? 28 : 12;
  });
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${buildFileBaseName(rows)}.xlsx`,
  );
}

export function exportDebetNotaText(rows: DebetNotaRow[], date: string): void {
  const lines = buildDebetNotaZf0002Rows(rows, date).map((row) =>
    row.map((cell) => cell == null ? "" : String(cell)).join("\t"),
  );
  saveAs(
    new Blob([`${lines.join("\r\n")}\r\n`], { type: "text/plain;charset=utf-8" }),
    `${buildFileBaseName(rows)}.txt`,
  );
}
