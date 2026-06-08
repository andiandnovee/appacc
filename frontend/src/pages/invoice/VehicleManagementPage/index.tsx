import { useState, useCallback, useRef, useMemo } from "react";
import VehicleFormDrawer from "./VehicleFormDrawer";
import Button from "../../../components/ui/Button";
import { SplitButton } from "../../../components/ui/Button";
import Table from "../../../components/ui/Table";
import type { Column } from "../../../components/ui/Table";
import Collapsible from "../../../components/ui/Collapsible";
import { useToast } from "../../../components/ui/Toast";
import { Trash2 } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import styles from "./VehicleManagement.module.css";
import apiClient from "../../../api/axios";

// ── Interfaces ────────────────────────────────────────────────
interface TableHandle {
  refetch: () => void;
  setSearch: (value: string) => void;
  data: any[];
  loading: boolean;
}

interface Vehicle {
  id: number;
  vehicle_type: string | null;
  company_code: string | null;
  business_area_code: string | null;
  description: string | null;
  plate_number: string | null;
  plate_number_old: string | null;
  cost_center: string | null;
  chassis_number: string | null;
  engine_number: string | null;
  is_active: string | null;
  notes: string | null;
  stnkb_valid_until: string | null;
  pkb_valid_until: string | null;
  kier_valid_until: string | null;
}

// ── Helpers ───────────────────────────────────────────────────
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isExpiringSoon(dateStr: string | null, days = 30): boolean {
  if (!dateStr) return false;
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < days * 86400000;
}

function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}

// ── Komponen ──────────────────────────────────────────────────
export default function VehicleManagement() {
  const tableRef = useRef<TableHandle | null>(null);
  const { addToast } = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(true);

  // ── Handlers ──────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (vehicle: Vehicle) => {
      if (
        !confirm(
          `Hapus kendaraan "${vehicle.plate_number || vehicle.description || `ID ${vehicle.id}`}"?\nTindakan ini tidak dapat dibatalkan.`,
        )
      )
        return;

      setDeletingId(vehicle.id);
      try {
        await apiClient.delete(`/vehicles/${vehicle.id}`);
        addToast({ variant: "success", title: "Kendaraan berhasil dihapus." });
        tableRef.current?.refetch();
      } catch {
        addToast({ variant: "danger", title: "Gagal menghapus kendaraan." });
      } finally {
        setDeletingId(null);
      }
    },
    [addToast],
  );

  const handleSaved = useCallback(() => {
    addToast({
      variant: "success",
      title: "Data kendaraan berhasil disimpan.",
    });
    tableRef.current?.refetch();
    setDrawerOpen(false);
    setEditTarget(null);
  }, [addToast]);

  const openEdit = useCallback((vehicle: Vehicle) => {
    setEditTarget(vehicle);
    setDrawerOpen(true);
  }, []);

  // ── Columns ───────────────────────────────────────────────────
  const columns = useMemo<Column[]>(
    () => [
      {
        key: "plate_number",
        label: "Plat Nomor",
        sortable: true,
        cardRole: "title",
        render: (row: Vehicle) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span className={styles.code}>{row.plate_number || "—"}</span>
            {row.plate_number_old && (
              <span className={styles.oldPlate}>{row.plate_number_old}</span>
            )}
          </div>
        ),
        exportValue: (row: Vehicle) => row.plate_number ?? "",
      },
      {
        key: "description",
        label: "Keterangan",
        sortable: true,
        cardRole: "subtitle",
        render: (row: Vehicle) => (
          <span className={styles.muted}>{row.description || "—"}</span>
        ),
      },
      {
        key: "vehicle_type",
        label: "Tipe",
        sortable: true,
        collapsible: true,
        collapseOrder: 4,
        render: (row: Vehicle) =>
          row.vehicle_type ? (
            <Badge variant="info" size="sm" pill>
              {row.vehicle_type}
            </Badge>
          ) : (
            <span className={styles.muted}>—</span>
          ),
        exportValue: (row: Vehicle) => row.vehicle_type ?? "",
      },
      {
        key: "is_active",
        label: "Status",
        sortable: false,
        collapsible: true,
        collapseOrder: 3,
        cardRole: "badge",
        render: (row: Vehicle) => {
          const active =
            row.is_active === "1" ||
            row.is_active?.toLowerCase() === "y" ||
            row.is_active?.toLowerCase() === "yes" ||
            row.is_active?.toLowerCase() === "active";
          return (
            <Badge variant={active ? "success" : "default"} size="sm" pill dot>
              {active ? "Aktif" : "Nonaktif"}
            </Badge>
          );
        },
        exportValue: (row: Vehicle) => row.is_active ?? "",
      },
      {
        key: "company_code",
        label: "Perusahaan",
        sortable: true,
        collapsible: true,
        collapseOrder: 5,
        render: (row: Vehicle) => (
          <span className={styles.code}>{row.company_code || "—"}</span>
        ),
        exportValue: (row: Vehicle) => row.company_code ?? "",
      },
      {
        key: "business_area_code",
        label: "Business Area",
        sortable: true,
        collapsible: true,
        collapseOrder: 6,
        render: (row: Vehicle) => (
          <span className={styles.code}>{row.business_area_code || "—"}</span>
        ),
        exportValue: (row: Vehicle) => row.business_area_code ?? "",
      },
      {
        key: "cost_center",
        label: "Cost Center",
        sortable: true,
        collapsible: true,
        collapseOrder: 7,
        render: (row: Vehicle) => (
          <span className={styles.code}>{row.cost_center || "—"}</span>
        ),
        exportValue: (row: Vehicle) => row.cost_center ?? "",
      },
      {
        key: "stnkb_valid_until",
        label: "STNKB",
        sortable: true,
        collapsible: true,
        collapseOrder: 1,
        render: (row: Vehicle) => {
          const expired = isExpired(row.stnkb_valid_until);
          const soon = isExpiringSoon(row.stnkb_valid_until);
          return (
            <span
              className={
                expired
                  ? styles.dateExpired
                  : soon
                    ? styles.dateSoon
                    : styles.muted
              }
            >
              {formatDate(row.stnkb_valid_until)}
            </span>
          );
        },
        exportValue: (row: Vehicle) => formatDate(row.stnkb_valid_until),
      },
      {
        key: "pkb_valid_until",
        label: "PKB",
        sortable: true,
        collapsible: true,
        collapseOrder: 2,
        render: (row: Vehicle) => {
          const expired = isExpired(row.pkb_valid_until);
          const soon = isExpiringSoon(row.pkb_valid_until);
          return (
            <span
              className={
                expired
                  ? styles.dateExpired
                  : soon
                    ? styles.dateSoon
                    : styles.muted
              }
            >
              {formatDate(row.pkb_valid_until)}
            </span>
          );
        },
        exportValue: (row: Vehicle) => formatDate(row.pkb_valid_until),
      },
      {
        key: "kier_valid_until",
        label: "KIR",
        sortable: true,
        collapsible: true,
        collapseOrder: 0,
        render: (row: Vehicle) => {
          const expired = isExpired(row.kier_valid_until);
          const soon = isExpiringSoon(row.kier_valid_until);
          return (
            <span
              className={
                expired
                  ? styles.dateExpired
                  : soon
                    ? styles.dateSoon
                    : styles.muted
              }
            >
              {formatDate(row.kier_valid_until)}
            </span>
          );
        },
        exportValue: (row: Vehicle) => formatDate(row.kier_valid_until),
      },
      {
        key: "actions",
        label: "Aksi",
        sortable: false,
        exportable: false,
        render: (row: Vehicle) => (
          <SplitButton
            label="Edit"
            variant="outline"
            size="sm"
            onClick={() => openEdit(row)}
            options={[
              {
                label: "Hapus",
                icon: <Trash2 size={13} />,
                onClick: () => handleDelete(row),
              },
            ]}
            disabled={deletingId === row.id}
          />
        ),
      },
    ],
    [handleDelete, openEdit, deletingId],
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manajemen Kendaraan</h1>
          <p className={styles.pageSubtitle}>
            Data kendaraan operasional perusahaan
          </p>
        </div>
      </div>

      {/* ── Form Tambah ── */}
      <Collapsible
        title="Tambah Kendaraan Baru"
        subtitle="Isi data kendaraan dengan lengkap"
        defaultOpen={true}
        open={addOpen}
        onToggle={setAddOpen}
      >
        <VehicleFormDrawer
          vehicle={null}
          onCancel={() => setAddOpen(false)}
          onSaved={() => {
            addToast({
              variant: "success",
              title: "Kendaraan berhasil ditambahkan.",
            });
            tableRef.current?.refetch();
          }}
        />
      </Collapsible>

      {/* ── Drawer Edit ── */}
      <VehicleFormDrawer
        vehicle={editTarget}
        isDrawer
        drawerOpen={drawerOpen}
        onDrawerClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onCancel={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSaved={handleSaved}
      />

      {/* ── Tabel ── */}
      <Collapsible title="Daftar Kendaraan" defaultOpen={true}>
        <Table
          ref={tableRef}
          url="/vehicles"
          columns={columns}
          dataKey="data"
          pageSize={15}
          exportName="vehicles_export"
          title=""
          searchable={true}
          selectable={false}
          serverSide={true}
          serverSideFiltering={true}
          tableId="vehicles"
        />
      </Collapsible>
    </div>
  );
}
