import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet, RotateCcw, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import api from "../../../api/axios";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import { useDebetNotaDraft, type DebetNotaRow } from "../../../stores/debetNotaDraft";
import styles from "./DebetNota.module.css";

interface Company { id: number; sap_id: string; name: string }
interface BusinessArea {
  id: number; sap_id: string; company_id: number; name: string;
  sap_vendor_code: string | null; company?: { id: number; name: string };
}
interface GLAccount {
  id: number; gl_acc: string | null; gl_text: string | null; gl_group: string | null;
  desc: string | null; other_desc: string | null;
}
interface CostCenter { id: number; sap_id: string | null; description: string | null; short_name: string | null }
interface PageResponse<T> { data: T[]; meta?: { last_page?: number }; last_page?: number }
interface MasterData {
  companies: Company[];
  businessAreas: BusinessArea[];
  glAccounts: GLAccount[];
  costCenters: CostCenter[];
}

const REQUIRED_HEADERS = [
  "Sender CC", "Sender BA", "Sender Doc", "Posting Date", "Period", "Fiscal Year",
  "Receiver BA", "Amount in Local", "Description",
];
const EXPENSE_WORDS = /biaya|beban|expense|expenses|cost/i;

function unwrap<T>(payload: any): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (Array.isArray(payload?.data)) return payload.data as T[];
  return [];
}

async function fetchAllPages<T>(url: string): Promise<T[]> {
  const first = await api.get<PageResponse<T>>(url, { params: { per_page: 100, page: 1 } });
  const firstPayload = first.data;
  const all = unwrap<T>(firstPayload);
  const lastPage = Number(firstPayload?.meta?.last_page ?? firstPayload?.last_page ?? 1);
  if (lastPage <= 1) return all;
  const rest = await Promise.all(Array.from({ length: lastPage - 1 }, (_, index) =>
    api.get<PageResponse<T>>(url, { params: { per_page: 100, page: index + 2 } }),
  ));
  return all.concat(...rest.map((response) => unwrap<T>(response.data)));
}

function text(value: unknown): string {
  return value == null ? "" : String(value).trim();
}

function amountValue(value: unknown): number {
  if (typeof value === "number") return value;
  const normalized = text(value).replace(/[^\d-]/g, "");
  return normalized ? Number(normalized) : Number.NaN;
}

function postingDateValue(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const localDate = new Date(value.getTime() + value.getTimezoneOffset() * 60_000);
    return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
  }
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
  }
  return text(value);
}

function accountIsExpense(account: GLAccount): boolean {
  return [account.gl_text, account.gl_group, account.desc, account.other_desc]
    .some((value) => EXPENSE_WORDS.test(value ?? ""));
}

export default function DebetNotaPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const mastersRef = useRef<MasterData | null>(null);
  const { fileName, rows, setUpload, updateRow, clear } = useDebetNotaDraft();
  const [glAccounts, setGlAccounts] = useState<GLAccount[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [masterLoading, setMasterLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadMasters = useCallback(async (): Promise<MasterData> => {
    if (mastersRef.current) return mastersRef.current;
    setMasterLoading(true);
    try {
      const [companyResponse, areaResponse, accounts, centers] = await Promise.all([
        api.get("/companies"),
        api.get("/busa"),
        fetchAllPages<GLAccount>("/gl-accounts"),
        fetchAllPages<CostCenter>("/cost-centers"),
      ]);
      const masters: MasterData = {
        companies: unwrap<Company>(companyResponse.data),
        businessAreas: unwrap<BusinessArea>(areaResponse.data),
        glAccounts: accounts.filter((account) => account.gl_acc),
        costCenters: centers.filter((center) => center.sap_id),
      };
      mastersRef.current = masters;
      setGlAccounts(masters.glAccounts);
      setCostCenters(masters.costCenters);
      return masters;
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Master Company, Business Area, GL, atau Cost Center gagal dimuat.");
      throw requestError;
    } finally {
      setMasterLoading(false);
    }
  }, []);

  const expenseFirstAccounts = useMemo(() => [...glAccounts].sort((a, b) => {
    const priority = Number(accountIsExpense(b)) - Number(accountIsExpense(a));
    if (priority !== 0) return priority;
    return `${a.gl_acc} ${a.gl_text}`.localeCompare(`${b.gl_acc} ${b.gl_text}`);
  }), [glAccounts]);

  const handleFile = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("File tidak memiliki sheet yang dapat dibaca.");
      const matrix = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], {
        header: 1, defval: "", raw: true, blankrows: false,
      });
      const headers = (matrix[0] ?? []).map(text);
      const missing = REQUIRED_HEADERS.filter((header) => !headers.includes(header));
      if (missing.length) throw new Error(`Kolom wajib tidak ditemukan: ${missing.join(", ")}.`);
      const column = new Map(headers.map((header, index) => [header, index]));
      const records = matrix.slice(1).filter((record) => record.some((value) => text(value)));
      if (!records.length) throw new Error("Tidak ada baris transaksi pada sheet pertama.");

      const read = (record: unknown[], header: string) => record[column.get(header) ?? -1];
      const senderAreaValues = records.map((record) => text(read(record, "Sender BA")));
      const receiverAreaValues = records.map((record) => text(read(record, "Receiver BA")));
      const senderCompanyValues = records.map((record) => text(read(record, "Sender CC")));
      if ([...senderAreaValues, ...receiverAreaValues, ...senderCompanyValues].some((value) => !value)) {
        throw new Error("Sender CC, Sender BA, dan Receiver BA wajib terisi pada setiap baris.");
      }
      const senderAreas = new Set(senderAreaValues);
      const receiverAreas = new Set(receiverAreaValues);
      const senderCompanies = new Set(senderCompanyValues);
      if (senderAreas.size !== 1 || receiverAreas.size !== 1 || senderCompanies.size !== 1) {
        throw new Error("Satu file harus berisi satu Sender CC, Sender BA, dan Receiver BA.");
      }

      const masters = await loadMasters();
      const senderCode = [...senderAreas][0];
      const receiverCode = [...receiverAreas][0];
      const senderCompanyCode = [...senderCompanies][0];
      const senderArea = masters.businessAreas.find((area) => String(area.sap_id) === senderCode);
      const receiverArea = masters.businessAreas.find((area) => String(area.sap_id) === receiverCode);
      if (!senderArea) throw new Error(`Business Area pengirim ${senderCode} tidak ditemukan di master.`);
      if (!senderArea.sap_vendor_code) throw new Error(`Vendor SAP belum diisi pada Business Area pengirim ${senderCode}.`);
      if (!receiverArea) throw new Error(`Business Area penerima ${receiverCode} tidak ditemukan di master.`);
      const senderCompany = masters.companies.find((company) => String(company.id) === String(senderArea.company_id));
      if (!senderCompany || String(senderCompany.sap_id) !== senderCompanyCode) {
        throw new Error(`Sender CC ${senderCompanyCode} tidak sesuai dengan company pemilik BA ${senderCode}.`);
      }
      const receiverCompany = masters.companies.find((company) => String(company.id) === String(receiverArea.company_id));
      if (!receiverCompany) throw new Error(`Company penerima untuk BA ${receiverCode} tidak ditemukan.`);

      const parsed: DebetNotaRow[] = records.map((record, index): DebetNotaRow => {
        const amount = amountValue(read(record, "Amount in Local"));
        const description = text(read(record, "Description"));
        const senderDocument = text(read(record, "Sender Doc"));
        const period = text(read(record, "Period"));
        const fiscalYear = text(read(record, "Fiscal Year"));
        if (!Number.isFinite(amount) || amount <= 0) throw new Error(`Amount in Local pada baris Excel ${index + 2} harus angka positif.`);
        if (!description) throw new Error(`Description pada baris Excel ${index + 2} wajib diisi.`);
        if (!senderDocument || !period || !fiscalYear || !postingDateValue(read(record, "Posting Date"))) {
          throw new Error(`Sender Doc, Posting Date, Period, dan Fiscal Year pada baris Excel ${index + 2} wajib diisi.`);
        }
        return {
          id: `${index}-${senderDocument}-${receiverCode}`,
          senderCompanyCode,
          senderBusinessArea: senderCode,
          senderDocument,
          postingDate: postingDateValue(read(record, "Posting Date")),
          period,
          fiscalYear,
          senderVendorCode: String(senderArea.sap_vendor_code),
          receiverCompanyCode: String(receiverCompany.sap_id),
          receiverCompanyName: receiverCompany.name,
          receiverBusinessArea: receiverCode,
          description,
          amount,
          glAccountId: null,
          costCenterCode: "",
        };
      });
      setUpload(file.name, parsed);
    } catch (parseError: any) {
      setError(parseError?.message || "File XLSX gagal dibaca.");
    } finally {
      setUploading(false);
    }
  }, [loadMasters, setUpload]);

  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const receiver = rows[0];
  const centerPrefix = receiver?.receiverBusinessArea ?? "";
  const receiverCostCenters = useMemo(() => costCenters.filter((center) =>
    String(center.sap_id ?? "").startsWith(centerPrefix),
  ), [costCenters, centerPrefix]);
  const money = useMemo(() => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }), []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.pageIcon}><FileSpreadsheet size={20} /></span>
          <div>
            <h1>Generator Jurnal Biaya · Debet Nota</h1>
            <p>Unggah XLSX sumber, pilih akun biaya dan Cost Center untuk BusArea penerima.</p>
          </div>
        </div>
        {rows.length > 0 && <Button variant="outline" onClick={() => { clear(); setError(""); }}><RotateCcw size={15} /> Reset draft</Button>}
      </header>

      <section className={styles.uploadCard}>
        <div className={styles.uploadCopy}>
          <span className={styles.uploadIcon}><Upload size={19} /></span>
          <div>
            <strong>Upload data Debet Nota</strong>
            <p>File diproses di browser dan draft tersimpan di local storage perangkat ini.</p>
            {fileName && <span className={styles.fileName}><CheckCircle2 size={14} /> {fileName}</span>}
          </div>
        </div>
        <input ref={inputRef} className={styles.hiddenInput} type="file" accept=".xlsx,.xls" onChange={handleFile} />
        <Button onClick={() => inputRef.current?.click()} loading={uploading || masterLoading}>
          <Upload size={16} /> Pilih File XLSX
        </Button>
      </section>

      {masterLoading && <div className={styles.notice}>Memuat master Company, Business Area, GL Account, dan Cost Center…</div>}
      {error && <div className={styles.errorNotice} role="alert"><AlertCircle size={17} /> {error}</div>}

      {rows.length > 0 && receiver && (
        <>
          <section className={styles.receiverCard}>
            <div>
              <span className={styles.eyebrow}>Company Code / Nama Receiver</span>
              <strong>{receiver.receiverCompanyCode} · {receiver.receiverCompanyName}</strong>
            </div>
            <div>
              <span className={styles.eyebrow}>BusArea Penerima</span>
              <strong>{receiver.receiverBusinessArea}</strong>
              <small>Cost Center harus berawalan {centerPrefix}.</small>
            </div>
            <div>
              <span className={styles.eyebrow}>Referensi Pengirim</span>
              <strong>BA {receiver.senderBusinessArea} · Vendor {receiver.senderVendorCode}</strong>
            </div>
          </section>

          <section className={styles.tableCard}>
            <div className={styles.tableHeading}>
              <div><h2>Rincian biaya</h2><p>{rows.length} baris dari {fileName}</p></div>
              <span className={styles.totalPill}>Total <strong>{money.format(total)}</strong></span>
            </div>
            {receiverCostCenters.length === 0 && <div className={styles.inlineWarning}>Belum ada Cost Center pada master dengan prefix {centerPrefix}.</div>}
            <div className={styles.tableScroll}>
              <table>
                <thead><tr><th>Description</th><th>GL Acc <span>· biaya diprioritaskan</span></th><th>CostCenter <span>· {centerPrefix}…</span></th><th className={styles.amountHead}>Jumlah</th></tr></thead>
                <tbody>{rows.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.descriptionCell}>{row.description}</td>
                    <td>
                      <Select
                        aria-label={`GL biaya untuk ${row.description}`}
                        value={row.glAccountId ?? ""}
                        placeholder="Pilih GL Account"
                        size="sm"
                        options={expenseFirstAccounts.map((account) => ({
                          value: account.id,
                          label: `${account.gl_acc} — ${account.gl_text || account.desc || "Tanpa nama"}${accountIsExpense(account) ? " · Biaya" : ""}`,
                        }))}
                        onChange={(event: { target: { value: unknown } }) => updateRow(row.id, { glAccountId: event.target.value ? Number(event.target.value) : null })}
                      />
                    </td>
                    <td>
                      <Select
                        aria-label={`Cost Center untuk ${row.description}`}
                        value={row.costCenterCode}
                        placeholder={receiverCostCenters.length ? `Pilih CC ${centerPrefix}…` : `CC ${centerPrefix} tidak tersedia`}
                        size="sm"
                        disabled={receiverCostCenters.length === 0}
                        options={receiverCostCenters.map((center) => ({ value: center.sap_id!, label: `${center.sap_id} — ${center.short_name || center.description || ""}` }))}
                        onChange={(event: { target: { value: string } }) => updateRow(row.id, { costCenterCode: event.target.value })}
                      />
                    </td>
                    <td className={styles.amountCell}>{money.format(row.amount)}</td>
                  </tr>
                ))}</tbody>
                <tfoot><tr><td colSpan={3}>Total</td><td className={styles.amountCell}>{money.format(total)}</td></tr></tfoot>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
