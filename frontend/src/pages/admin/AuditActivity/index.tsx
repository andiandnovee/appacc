import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, RefreshCw, ShieldCheck } from "lucide-react";
import { Navigate } from "react-router-dom";
import api from "../../../api/axios";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useToast } from "../../../components/ui/Toast";
import { useAuth } from "../../../hooks/useAuth";
import styles from "./AuditActivity.module.css";

interface AuditEvent {
  id: string;
  event_code: string;
  business_domain: string;
  action: string;
  severity: "info" | "notice" | "warning" | "critical";
  outcome: "success" | "failed" | "denied" | "partial";
  subject_label: string | null;
  description: string;
  actor_name: string | null;
  ip_address: string | null;
  occurred_at: string;
}

interface AuditRule {
  id: number;
  event_code: string;
  business_domain: string;
  label: string;
  notify_in_app: boolean;
  notify_push: boolean;
  is_active: boolean;
  recipient_targets: string[] | null;
}

const severityVariant: Record<AuditEvent["severity"], "info" | "primary" | "warning" | "danger"> = {
  info: "info",
  notice: "primary",
  warning: "warning",
  critical: "danger",
};

const outcomeVariant: Record<AuditEvent["outcome"], "success" | "danger" | "warning"> = {
  success: "success",
  failed: "danger",
  denied: "warning",
  partial: "warning",
};

export default function AuditActivityPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const roles = Array.isArray(user?.roles) ? user.roles.map((role: string) => role.toLowerCase()) : [];
  const canView = roles.includes("super-admin");
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [rules, setRules] = useState<AuditRule[]>([]);
  const [recipientDrafts, setRecipientDrafts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const loadAudit = useCallback(async () => {
    setLoading(true);
    try {
      const [eventResponse, ruleResponse] = await Promise.all([
        api.get("/admin/audit/events", {
          params: {
            per_page: 50,
            search: search.trim() || undefined,
            business_domain: domain || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
          },
        }),
        api.get("/admin/audit/catalog"),
      ]);
      setEvents(eventResponse.data.data ?? []);
      setRules(ruleResponse.data.data ?? []);
      setRecipientDrafts({});
    } catch (error) {
      addToast({ variant: "danger", title: "Gagal memuat Audit Activity." });
      console.error("Gagal memuat Audit Activity.", error);
    } finally {
      setLoading(false);
    }
  }, [addToast, dateFrom, dateTo, domain, search]);

  useEffect(() => {
    if (canView) void loadAudit();
  }, [canView, loadAudit]);

  const domains = useMemo(
    () => [...new Set(rules.map((rule) => rule.business_domain))],
    [rules],
  );

  const updateRule = async (rule: AuditRule, changes: Partial<AuditRule>) => {
    const updated = { ...rule, ...changes };
    setRules((current) => current.map((item) => item.id === rule.id ? updated : item));

    try {
      const response = await api.put(`/admin/audit/rules/${rule.id}`, {
        notify_in_app: updated.notify_in_app,
        notify_push: updated.notify_push,
        is_active: updated.is_active,
        recipient_targets: updated.recipient_targets ?? [],
      });
      setRules((current) => current.map((item) => item.id === rule.id ? response.data.data : item));
      setRecipientDrafts((current) => {
        const next = { ...current };
        delete next[rule.id];
        return next;
      });
      addToast({ variant: "success", title: "Rule notifikasi tersimpan." });
    } catch (error: any) {
      setRules((current) => current.map((item) => item.id === rule.id ? rule : item));
      addToast({
        variant: "danger",
        title: error?.response?.data?.message ?? "Gagal menyimpan rule notifikasi.",
      });
      console.error("Gagal menyimpan rule notifikasi.", error);
    }
  };

  if (!canView) return <Navigate to="/" replace />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1><Activity size={22} /> Audit Activity</h1>
          <p>Riwayat aktivitas backend APPACC dan konfigurasi notifikasi per event.</p>
        </div>
        <Button variant="secondary" onClick={() => void loadAudit()} disabled={loading}>
          <RefreshCw size={16} /> Muat ulang
        </Button>
      </header>

      <Card variant="outlined" padding="md">
        <div className={styles.filters}>
          <Input label="Cari event" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select
            label="Domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
            options={[{ value: "", label: "Semua domain" }, ...domains.map((value) => ({ value, label: value }))]}
          />
          <Input label="Dari tanggal" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          <Input label="Sampai tanggal" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
        </div>
      </Card>

      <section className={styles.events} aria-busy={loading}>
        {events.length === 0 && !loading ? (
          <Card variant="outlined" padding="lg" className={styles.empty}>Belum ada event sesuai filter.</Card>
        ) : events.map((event) => (
          <Card variant="outlined" padding="md" className={styles.event} key={event.id}>
            <div className={styles.eventHeading}>
              <div>
                <strong>{event.description}</strong>
                <small>{event.event_code} · {event.business_domain} · {event.action}</small>
              </div>
              <time dateTime={event.occurred_at}>{new Date(event.occurred_at).toLocaleString("id-ID")}</time>
            </div>
            <div className={styles.badges}>
              <Badge size="sm" variant={severityVariant[event.severity]}>{event.severity}</Badge>
              <Badge size="sm" variant={outcomeVariant[event.outcome]}>{event.outcome}</Badge>
              <span>{event.actor_name ?? "Sistem"}</span>
              {event.subject_label && <span>· {event.subject_label}</span>}
              {event.ip_address && <span>· {event.ip_address}</span>}
            </div>
          </Card>
        ))}
      </section>

      <section className={styles.ruleSection}>
        <div className={styles.ruleHeader}>
          <h2><ShieldCheck size={20} /> Rule notifikasi</h2>
          <p>Semua rule mulai nonaktif; tentukan penerima secara eksplisit sebelum mengaktifkan kanal.</p>
        </div>
        {rules.map((rule) => (
          <Card variant="outlined" padding="md" className={styles.rule} key={rule.id}>
            <div className={styles.ruleTitle}>
              <strong>{rule.label}</strong>
              <small>{rule.event_code} · {rule.business_domain}</small>
            </div>
            <label>
              <input
                type="text"
                aria-label={`Penerima ${rule.event_code}`}
                placeholder="actor, role:accounting, user:12"
                value={recipientDrafts[rule.id] ?? (rule.recipient_targets ?? []).join(", ")}
                onChange={(event) => {
                  setRecipientDrafts((current) => ({ ...current, [rule.id]: event.target.value }));
                }}
                onBlur={(event) => {
                  const recipientTargets = [...new Set(event.target.value.split(",").map((target) => target.trim()).filter(Boolean))];
                  void updateRule(rule, { recipient_targets: recipientTargets });
                }}
              />
            </label>
            <div className={styles.ruleControls}>
              <label><input type="checkbox" checked={rule.notify_in_app} onChange={(event) => void updateRule(rule, { notify_in_app: event.target.checked })} /> In-app</label>
              <label><input type="checkbox" checked={rule.notify_push} onChange={(event) => void updateRule(rule, { notify_push: event.target.checked })} /> Push</label>
              <label><input type="checkbox" checked={rule.is_active} onChange={(event) => void updateRule(rule, { is_active: event.target.checked })} /> Aktif</label>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
