import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, FileSpreadsheet, LoaderCircle, RotateCcw, Search, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import api from "../../../api/axios";
import Button from "../../../components/ui/Button";
import { useDebetNotaDraft, type DebetNotaGlHistoryItem, type DebetNotaRow } from "../../../stores/debetNotaDraft";
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
interface SearchOption { id: number; code: string; label: string; isExpense: boolean; isHistory?: boolean }
interface DropdownPosition { top: number; left: number; width: number; maxHeight: number }
const masterSearchCache = new Map<string, Promise<PageResponse<GLAccount | CostCenter>>>();

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

interface AsyncMasterSelectProps {
  kind: "gl" | "cost-center";
  receiverBusinessArea: string;
  selectedLabel: string;
  glHistory: DebetNotaGlHistoryItem[];
  onSelect: (option: SearchOption) => void;
}

function AsyncMasterSelect({ kind, receiverBusinessArea, selectedLabel, glHistory, onSelect }: AsyncMasterSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const endpoint = kind === "gl" ? "/gl-accounts" : "/cost-centers";
  const costCenterPrefix = `${receiverBusinessArea}3`;
  const preferredGlPrefix = "7";
  const initialQuery = kind === "gl" ? preferredGlPrefix : costCenterPrefix;

  const fetchOptions = useCallback(async (search: string, requestedPage = 1, append = false) => {
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const cacheKey = `${endpoint}:${search}:${requestedPage}`;
      let responsePromise = masterSearchCache.get(cacheKey);
      if (!responsePromise) {
        if (masterSearchCache.size >= 40) {
          const oldestKey = masterSearchCache.keys().next().value;
          if (oldestKey) masterSearchCache.delete(oldestKey);
        }
        responsePromise = api.get<PageResponse<GLAccount | CostCenter>>(endpoint, {
          params: { search, per_page: 100, page: requestedPage },
        }).then((response) => response.data);
        masterSearchCache.set(cacheKey, responsePromise);
      }
      const response = await responsePromise;
      if (requestId !== requestRef.current) return;
      const source = unwrap<GLAccount | CostCenter>(response);
      const serverOptions: SearchOption[] = kind === "gl"
          ? (source as GLAccount[]).filter((item) => item.gl_acc?.startsWith(preferredGlPrefix)).map((item) => ({
            id: item.id,
            code: item.gl_acc!,
            label: `${item.gl_acc} — ${item.gl_text || item.desc || "Tanpa nama"}`,
            isExpense: accountIsExpense(item),
          }))
        : (source as CostCenter[]).filter((item) =>
            item.sap_id && item.sap_id.startsWith(costCenterPrefix),
          ).map((item) => ({
            id: item.id,
            code: item.sap_id!,
            label: `${item.sap_id} — ${item.short_name || item.description || ""}`,
            isExpense: false,
          }));
      const historyOptions: SearchOption[] = kind === "gl"
        ? glHistory
          .filter((item) => {
            const normalizedSearch = search.trim().toLocaleLowerCase();
            return item.code.startsWith(preferredGlPrefix)
              && (!normalizedSearch || `${item.code} ${item.label}`.toLocaleLowerCase().includes(normalizedSearch));
          })
          .map((item) => ({ ...item, isExpense: true, isHistory: true }))
        : [];
      const matchingHistoryIds = new Set(historyOptions.map((option) => option.id));
      const merged = [
        ...historyOptions,
        ...serverOptions.filter((option) => !matchingHistoryIds.has(option.id)),
      ];
      const sorted = kind === "gl"
        ? merged.sort((left, right) => {
          const leftHistoryIndex = historyOptions.findIndex((option) => option.id === left.id);
          const rightHistoryIndex = historyOptions.findIndex((option) => option.id === right.id);
          if (leftHistoryIndex !== -1 || rightHistoryIndex !== -1) {
            if (leftHistoryIndex === -1) return 1;
            if (rightHistoryIndex === -1) return -1;
            return leftHistoryIndex - rightHistoryIndex;
          }
          const leftPreferred = left.code.startsWith(preferredGlPrefix);
          const rightPreferred = right.code.startsWith(preferredGlPrefix);
          return Number(rightPreferred) - Number(leftPreferred)
            || left.code.localeCompare(right.code, "en", { numeric: true });
        })
        : merged;
      setOptions((previous) => append ? [...previous, ...sorted] : sorted);
      const lastPage = Number(response?.meta?.last_page ?? response?.last_page ?? 1);
      setHasMore(requestedPage < lastPage);
      setPage(requestedPage);
    } catch {
      masterSearchCache.delete(`${endpoint}:${search}:${requestedPage}`);
      if (requestId === requestRef.current) {
        if (!append) setOptions([]);
        setHasMore(false);
      }
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [costCenterPrefix, endpoint, glHistory, kind, preferredGlPrefix]);

  const openAndLoad = (event: React.FocusEvent<HTMLInputElement>) => {
    if ((kind === "gl" && !receiverBusinessArea) || (kind === "cost-center" && !costCenterPrefix)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width, 260), window.innerWidth - 24);
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;
    const openAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(260, openAbove ? spaceAbove : spaceBelow));
    setDropdownPosition({
      top: openAbove ? rect.top - maxHeight - 4 : rect.bottom + 4,
      left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      width,
      maxHeight,
    });
    setOpen(true);
    if (!options.length && !loading) {
      const search = query || initialQuery;
      setQuery(search);
      void fetchOptions(search);
    }
  };

  const updateDropdownPosition = useCallback(() => {
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(Math.max(rect.width, 260), window.innerWidth - 24);
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;
    const openAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(260, openAbove ? spaceAbove : spaceBelow));
    setDropdownPosition({
      top: openAbove ? rect.top - maxHeight - 4 : rect.bottom + 4,
      left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      width,
      maxHeight,
    });
  }, []);

  const handleQuery = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setQuery(next);
    setOptions([]);
    setPage(1);
    setHasMore(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if ((kind === "gl" && !receiverBusinessArea) || (kind === "cost-center" && !costCenterPrefix)) return;
    debounceRef.current = setTimeout(() => {
      const search = next || initialQuery;
      if (search) void fetchOptions(search);
    }, 250);
  };

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    requestRef.current++;
  }, []);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);
    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [open, updateDropdownPosition]);

  return (
    <div className={styles.asyncSelect}>
      <div className={styles.asyncInputWrap}>
        <Search size={14} />
        <input
          ref={inputRef}
          value={open ? query : selectedLabel}
          placeholder={kind === "gl" ? "GL biaya 7… cari kode/nama" : `Cari CC ${costCenterPrefix}…`}
          onFocus={openAndLoad}
          onChange={handleQuery}
          onBlur={() => window.setTimeout(() => { setOpen(false); setDropdownPosition(null); }, 150)}
          aria-label={kind === "gl" ? "Cari GL Account" : "Cari Cost Center"}
        />
        {loading && <LoaderCircle size={14} className={styles.spinner} />}
      </div>
      {open && dropdownPosition && createPortal(
        <div
          ref={listRef}
          className={styles.asyncOptions}
          style={dropdownPosition}
          onMouseDown={(event) => event.preventDefault()}
          onScroll={(event) => {
            const element = event.currentTarget;
            if (hasMore && !loading && element.scrollHeight - element.scrollTop - element.clientHeight < 40) {
              void fetchOptions(query || initialQuery, page + 1, true);
            }
          }}
        >
          {options.map((option) => (
            <button
              type="button"
              key={`${option.id}-${option.code}`}
              className={styles.asyncOption}
              onClick={() => {
                onSelect(option);
                setOpen(false);
                setQuery("");
                inputRef.current?.blur();
              }}
            >
              <strong>{option.code}</strong><span>{option.label.slice(option.code.length + 3)}</span>
              {kind === "gl" && option.isHistory && <small>Riwayat</small>}
              {kind === "gl" && !option.isHistory && option.code.startsWith(preferredGlPrefix) && <small>Biaya</small>}
              {kind === "cost-center" && <small>Prefix BA</small>}
            </button>
          ))}
          {loading && <div className={styles.asyncMessage}>Memuat pilihan…</div>}
          {!loading && options.length === 0 && <div className={styles.asyncMessage}>Tidak ada hasil. Ubah kata pencarian.</div>}
          {!loading && hasMore && <div className={styles.asyncMessage}>Scroll untuk memuat pilihan berikutnya</div>}
        </div>,
        document.body,
      )}
    </div>
  );
}

export default function DebetNotaPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fileName, rows, glHistory, setUpload, resolveReferences, rememberGlAccount, updateRow, clear } = useDebetNotaDraft();
  const [masterLoading, setMasterLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const resolveUploadedReferences = useCallback(async (
    senderBusinessAreaCode: string,
    receiverBusinessAreaCode: string,
    senderCompanyCode: string,
  ) => {
    setError("");
    setMasterLoading(true);
    try {
      const [senderAreaResponse, receiverAreaResponse] = await Promise.all([
        api.get("/busa", { params: { search: senderBusinessAreaCode } }),
        api.get("/busa", { params: { search: receiverBusinessAreaCode } }),
      ]);
      const senderArea = unwrap<BusinessArea>(senderAreaResponse.data)
        .find((area) => String(area.sap_id) === senderBusinessAreaCode);
      const receiverArea = unwrap<BusinessArea>(receiverAreaResponse.data)
        .find((area) => String(area.sap_id) === receiverBusinessAreaCode);
      if (!senderArea) throw new Error(`Business Area pengirim ${senderBusinessAreaCode} tidak ditemukan di master.`);
      if (!senderArea.sap_vendor_code) throw new Error(`Vendor SAP belum diisi pada Business Area pengirim ${senderBusinessAreaCode}.`);
      if (!receiverArea) throw new Error(`Business Area penerima ${receiverBusinessAreaCode} tidak ditemukan di master.`);

      const companyIds = [...new Set([senderArea.company_id, receiverArea.company_id])];
      const companyResponses = await Promise.all(companyIds.map((id) => api.get(`/companies/${id}`)));
      const companies = companyResponses.map((response) => response.data?.data as Company);
      const senderCompany = companies.find((company) => String(company.id) === String(senderArea.company_id));
      const receiverCompany = companies.find((company) => String(company.id) === String(receiverArea.company_id));
      if (!senderCompany || String(senderCompany.sap_id) !== senderCompanyCode) {
        throw new Error(`Sender CC ${senderCompanyCode} tidak sesuai dengan company pemilik BA ${senderBusinessAreaCode}.`);
      }
      if (!receiverCompany) throw new Error(`Company penerima untuk BA ${receiverBusinessAreaCode} tidak ditemukan.`);

      resolveReferences(String(senderArea.sap_vendor_code), String(receiverCompany.sap_id), receiverCompany.name);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Referensi Business Area atau Company gagal dimuat.");
      throw requestError;
    } finally {
      setMasterLoading(false);
    }
  }, [resolveReferences]);

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
      const senderCcColumn = column.get("Sender CC");
      const records = matrix.slice(1).filter((record) =>
        senderCcColumn != null && Boolean(text(record[senderCcColumn])),
      );
      if (!records.length) throw new Error("Tidak ada baris transaksi dengan Sender CC pada sheet pertama.");

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

      const senderCode = [...senderAreas][0];
      const receiverCode = [...receiverAreas][0];
      const senderCompanyCode = [...senderCompanies][0];

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
          senderVendorCode: "",
          receiverCompanyCode: "",
          receiverCompanyName: "",
          receiverBusinessArea: receiverCode,
          description,
          amount,
          glAccountId: null,
          glAccountCode: "",
          glAccountLabel: "",
          costCenterCode: "",
          costCenterLabel: "",
        };
      });
      setUpload(file.name, parsed);
      await resolveUploadedReferences(senderCode, receiverCode, senderCompanyCode);
    } catch (parseError: any) {
      setError(parseError?.message || "File XLSX gagal dibaca.");
    } finally {
      setUploading(false);
    }
  }, [resolveUploadedReferences, setUpload]);

  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const receiver = rows[0];
  const centerPrefix = receiver?.receiverBusinessArea ?? "";
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

      {masterLoading && <div className={styles.notice}>Draft tersimpan. Memuat referensi BA pengirim dan Company penerima…</div>}
      {error && <div className={styles.errorNotice} role="alert"><AlertCircle size={17} /> {error}</div>}

      {rows.length > 0 && receiver && (
        <>
          <section className={styles.receiverCard}>
            <div>
              <span className={styles.eyebrow}>Company Code / Nama Receiver</span>
              <strong>{receiver.receiverCompanyCode || "—"} · {receiver.receiverCompanyName || (masterLoading ? "Memuat referensi…" : "Belum tersedia")}</strong>
            </div>
            <div>
              <span className={styles.eyebrow}>BusArea Penerima</span>
              <strong>{receiver.receiverBusinessArea}</strong>
              <small>Cost Center harus berawalan {centerPrefix}3.</small>
            </div>
            <div>
              <span className={styles.eyebrow}>Referensi Pengirim</span>
              <strong>BA {receiver.senderBusinessArea} · Vendor {receiver.senderVendorCode || (masterLoading ? "Memuat referensi…" : "Belum tersedia")}</strong>
              {!masterLoading && (!receiver.senderVendorCode || !receiver.receiverCompanyCode) && (
                <button
                  type="button"
                  className={styles.retryReferences}
                  onClick={() => void resolveUploadedReferences(receiver.senderBusinessArea, receiver.receiverBusinessArea, receiver.senderCompanyCode)}
                >
                  Coba muat ulang referensi
                </button>
              )}
            </div>
          </section>

          <section className={styles.tableCard}>
            <div className={styles.tableHeading}>
              <div><h2>Rincian biaya</h2><p>{rows.length} baris dari {fileName}</p></div>
              <span className={styles.totalPill}>Total <strong>{money.format(total)}</strong></span>
            </div>
            <div className={styles.tableScroll}>
              <table>
                <thead><tr><th>Description</th><th>GL Acc <span>· prefix 7 biaya</span></th><th>CostCenter <span>· {centerPrefix}3…</span></th><th className={styles.amountHead}>Jumlah</th></tr></thead>
                <tbody>{rows.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.descriptionCell}>{row.description}</td>
                    <td>
                      <AsyncMasterSelect
                        kind="gl"
                        receiverBusinessArea={centerPrefix}
                        selectedLabel={row.glAccountLabel || ""}
                        glHistory={glHistory}
                        onSelect={(option) => {
                          rememberGlAccount({ id: option.id, code: option.code, label: option.label });
                          updateRow(row.id, {
                            glAccountId: option.id,
                            glAccountCode: option.code,
                            glAccountLabel: option.label,
                          });
                        }}
                      />
                    </td>
                    <td>
                      <AsyncMasterSelect
                        kind="cost-center"
                        receiverBusinessArea={centerPrefix}
                        selectedLabel={row.costCenterLabel || ""}
                        onSelect={(option) => updateRow(row.id, {
                          costCenterCode: option.code,
                          costCenterLabel: option.label,
                        })}
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
