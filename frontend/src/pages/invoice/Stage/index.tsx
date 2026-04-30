import { useState, useCallback, useRef, useMemo } from "react";
import StageFormModal from "./StagesFormModal";
import Button from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import { useToast } from "../../../components/ui/Toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./Stages.module.css";
import api from "../../../api/axios";

// ======================== CONSTANTS ========================

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR - i);
// → [2025, 2024, 2023, 2022, 2021, 2020]

// ======================== TYPES ========================

interface Stage {
  id: number;
  name: string;
  start_date: string;
  year: number;
}

// ======================== COMPONENT ========================

export default function Stages() {
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [formTarget, setFormTarget]     = useState<Stage | {} | null>(null);
  const [deletingId, setDeletingId]     = useState<number | null>(null);
  const tableRef = useRef<any>(null);
  const { addToast } = useToast();

  const filterParams = useMemo<Record<string, any>>(
    () => ({ year: selectedYear }),
    [selectedYear],
  );

  const handleDelete = useCallback(
    async (stage: Stage, refetch: () => void) => {
      if (
        !confirm(
          `Hapus stage "${stage.name} (${stage.year})"? Tindakan ini tidak dapat dibatalkan.`,
        )
      )
        return;

      setDeletingId(stage.id);
      try {
        await api.delete(`/stages/${stage.id}`);
        addToast({ variant: "success", title: "Stage berhasil dihapus." });
        refetch();
      } catch {
        addToast({ variant: "danger", title: "Gagal menghapus stage." });
      } finally {
        setDeletingId(null);
      }
    },
    [addToast],
  );

  const handleSaved = useCallback(() => {
    setFormTarget(null);
    addToast({ variant: "success", title: "Data stage berhasil disimpan." });
    tableRef.current?.refetch();
  }, [addToast]);

  const columns = useMemo(
    () => [
      {
        key: "year",
        label: "Tahun",
        sortable: true,
        render: (row: Stage) => (
          <span className={styles.code}>{row.year || "—"}</span>
        ),
      },
      {
        key: "name",
        label: "Nama Stage",
        sortable: true,
        render: (row: Stage) => (
          <span className={styles.code}>{row.name || "—"}</span>
        ),
      },
      {
        key: "start_date",
        label: "Tanggal Mulai",
        sortable: true,
        render: (row: Stage) => (
          <span className={styles.muted}>
            {row.start_date
              ? new Date(row.start_date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Aksi",
        sortable: false,
        render: (row: Stage) => (
          <div className={styles.actions}>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Pencil size={13} />}
              onClick={() => setFormTarget(row)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Trash2 size={13} />}
              onClick={() => handleDelete(row, tableRef.current?.refetch)}
              disabled={deletingId === row.id}
              className={styles.deleteBtn}
            >
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete, deletingId],
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Stage</h1>
          <p className={styles.pageSubtitle}>
            Periode penerimaan invoice per tahun
          </p>
        </div>
        <Button iconLeft={<Plus size={14} />} onClick={() => setFormTarget({})}>
          Tambah Stage
        </Button>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tahun</label>
          <div className={styles.yearTabs}>
            {YEAR_OPTIONS.map((year) => (
              <button
                key={year}
                className={`${styles.yearTab} ${selectedYear === year ? styles.yearTabActive : ""}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Table
        ref={tableRef}
        url="/stages"
        columns={columns}
        dataKey="data"
        pageSize={15}
        exportName="stages_export"
        title="Daftar Stage"
        searchable={true}
        selectable={false}
        serverSide={true}
        serverSideFiltering={true}
        defaultParams={filterParams}
      />

      {formTarget !== null && (
        <StageFormModal
          stage={(formTarget as Stage).id ? (formTarget as Stage) : undefined}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}