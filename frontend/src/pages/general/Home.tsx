import { FC, ReactNode, ReactElement, useState } from "react";
import Card from "../../components/ui/Card";
import Collapsible from "../../components/ui/Collapsible";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";

export default function Home() {
  const { user, updateUser } = useAuth();

  const [sapUser, setSapUser] = useState(user?.sap_user ?? "");
  const [sapServer, setSapServer] = useState(user?.sap_server_con ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSaveSap = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await api.patch("/user/sap-profile", {
        sap_user: sapUser,
        sap_server_con: sapServer,
      });
      updateUser({
        sap_user: res.data.data.sap_user,
        sap_server_con: res.data.data.sap_server_con,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Gagal menyimpan, coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const title = (
    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
      Selamat datang, {user?.name ?? "..."} 👋
    </h1>
  );

  const sapTitle = (
    <span style={{ fontWeight: 600 }}>SAP Setting</span>
  );

  return (
    <div>
      <Collapsible title={title} subtitle="" defaultOpen>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
        >
          <Collapsible
            title={sapTitle}
            subtitle="Username & Server"
            defaultOpen={false}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <Input
                label="SAP Username"
                type="text"
                placeholder="Masukkan SAP username"
                value={sapUser}
                onChange={(e) => setSapUser(e.target.value)}
              />
              <Input
                label="SAP Server"
                type="text"
                placeholder="Masukkan SAP server connection"
                value={sapServer}
                onChange={(e) => setSapServer(e.target.value)}
              />
              {error && (
                <p style={{ color: "var(--color-danger)", fontSize: "var(--text-sm)" }}>
                  {error}
                </p>
              )}
              {saved && (
                <p style={{ color: "var(--color-success)", fontSize: "var(--text-sm)" }}>
                  ✓ Tersimpan
                </p>
              )}
              <Button
                variant="primary"
                onClick={handleSaveSap}
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </Collapsible>
        </div>
      </Collapsible>
    </div>
  );
}