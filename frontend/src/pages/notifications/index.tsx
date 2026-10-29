import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck, ExternalLink, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast";
import { disableWebPush, enableWebPush } from "../../lib/webPush";
import styles from "./Notifications.module.css";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
  event?: { event_code: string; business_domain: string } | null;
}

interface NotificationResponse {
  data: NotificationItem[];
  meta: { current_page: number; last_page: number; total: number };
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [pushPermission, setPushPermission] = useState(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  );
  const [pushBusy, setPushBusy] = useState(false);

  const loadNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get<NotificationResponse>("/notifications", {
        params: { page, per_page: 20 },
      });
      setItems(response.data.data ?? []);
      setCurrentPage(response.data.meta?.current_page ?? page);
      setLastPage(response.data.meta?.last_page ?? 1);
    } catch (error) {
      addToast({ variant: "danger", title: "Gagal memuat notifikasi." });
      console.error("Gagal memuat notification inbox.", error);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const markAllRead = async () => {
    try {
      await api.post("/notifications/read-all");
      await loadNotifications(currentPage);
    } catch (error) {
      addToast({ variant: "danger", title: "Gagal menandai notifikasi sebagai dibaca." });
      console.error("Gagal menandai semua notifikasi sebagai dibaca.", error);
    }
  };

  const openNotification = async (item: NotificationItem) => {
    if (!item.read_at) {
      try {
        await api.post(`/notifications/${item.id}/read`);
        setItems((current) => current.map((notification) =>
          notification.id === item.id ? { ...notification, read_at: new Date().toISOString() } : notification,
        ));
      } catch (error) {
        addToast({ variant: "danger", title: "Status notifikasi gagal diperbarui." });
        console.error("Gagal menandai notifikasi sebagai dibaca.", error);
        return;
      }
    }

    const destination = item.link;
    navigate(destination?.startsWith("/") && !destination.startsWith("//") ? destination : "/");
  };

  const togglePush = async () => {
    setPushBusy(true);
    try {
      if (pushPermission === "granted") {
        await disableWebPush();
        setPushPermission(Notification.permission);
        addToast({ variant: "success", title: "Notifikasi push dinonaktifkan di browser ini." });
      } else {
        const permission = await enableWebPush();
        setPushPermission(permission);
        if (permission === "granted") {
          addToast({ variant: "success", title: "Notifikasi push berhasil diaktifkan." });
        } else if (permission === "denied") {
          addToast({ variant: "warning", title: "Izin notifikasi diblokir oleh browser." });
        } else if (permission === "unsupported") {
          addToast({ variant: "warning", title: "Browser ini tidak mendukung web push." });
        }
      }
    } catch (error) {
      addToast({
        variant: "danger",
        title: error instanceof Error ? error.message : "Gagal mengatur notifikasi push.",
      });
      console.error("Gagal mengatur web push.", error);
    } finally {
      setPushBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1><Bell size={22} /> Notifikasi</h1>
          <p>Aktivitas dan pemberitahuan untuk akun Anda.</p>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={togglePush} loading={pushBusy} disabled={pushPermission === "unsupported"}>
            {pushPermission === "granted" ? "Matikan push" : "Aktifkan push"}
          </Button>
          <Button variant="secondary" onClick={markAllRead} disabled={!items.some((item) => !item.read_at)}>
            <CheckCheck size={16} /> Tandai semua dibaca
          </Button>
        </div>
      </header>

      <section className={styles.list} aria-live="polite">
        {loading ? (
          <Card variant="outlined" padding="lg" className={styles.empty}>
            <LoaderCircle size={22} className={styles.spinner} /> Memuat notifikasi...
          </Card>
        ) : items.length === 0 ? (
          <Card variant="outlined" padding="lg" className={styles.empty}>
            <Bell size={24} />
            <strong>Belum ada notifikasi</strong>
            <span>Notifikasi yang ditujukan ke akun Anda akan tampil di sini.</span>
          </Card>
        ) : items.map((item) => (
          <button
            type="button"
            className={`${styles.item} ${item.read_at ? "" : styles.unread}`}
            key={item.id}
            onClick={() => void openNotification(item)}
          >
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.itemContent}>
              <span className={styles.itemHeading}>
                <strong>{item.title}</strong>
                <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString("id-ID")}</time>
              </span>
              <span>{item.body}</span>
              {item.event && <small>{item.event.business_domain} · {item.event.event_code}</small>}
            </span>
            <ExternalLink size={16} />
          </button>
        ))}
      </section>

      <footer className={styles.pagination}>
        <Button variant="secondary" size="sm" disabled={currentPage <= 1 || loading} onClick={() => void loadNotifications(currentPage - 1)}>
          Sebelumnya
        </Button>
        <span>Halaman {currentPage} dari {lastPage}</span>
        <Button variant="secondary" size="sm" disabled={currentPage >= lastPage || loading} onClick={() => void loadNotifications(currentPage + 1)}>
          Berikutnya
        </Button>
      </footer>
    </div>
  );
}
