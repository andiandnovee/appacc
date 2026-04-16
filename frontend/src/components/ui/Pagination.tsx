import { FC, ReactNode, ReactElement } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page?: any;
  totalPages?: any;
  onChange?: any;
  totalRows?: any;
  pageSize?: any;
  showInfo?: any;
}



/**
 * Pagination
 * - page        → current page (wajib)
 * - totalPages  → total halaman (wajib)
 * - onChange    → (page: number) => void (wajib)
 * - totalRows   → total data (opsional, untuk info teks)
 * - pageSize    → baris per halaman (opsional, untuk info teks)
 * - showInfo    → tampilkan info "X - Y dari Z" (default: true)
 */
const Pagination: FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
  totalRows,
  pageSize,
  showInfo = true,
}) => {
  // Generate page numbers dengan ellipsis
  const getPages = () => {
    const pages = [];
    const delta = 1;
    const range = [];

    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 1) {
      pages.push(1);
      if (range[0] > 2) pages.push("...");
    }
    pages.push(...range);
    if (range.at(-1) < totalPages) {
      if (range.at(-1) < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const from = totalRows ? (page - 1) * pageSize + 1 : null;
  const to = totalRows ? Math.min(page * pageSize, totalRows) : null;

  return (
    <div className={styles.wrapper}>
      {/* Info */}
      {showInfo && totalRows && (
        <span className={styles.info}>
          {from}–{to} dari {totalRows} data
        </span>
      )}

      {/* Pages */}
      <div className={styles.pages}>
        <button
          className={styles.btn}
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`d${i}`} className={styles.dots}>
              …
            </span>
          ) : (
            <button
              key={p}
              className={`${styles.btn} ${page === p ? styles.active : ""}`}
              onClick={() => onChange(p)}
              aria-current={page === p ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}

        <button
          className={styles.btn}
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Berikutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;