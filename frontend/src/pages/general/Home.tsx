import { FC, ReactNode, ReactElement } from "react";
import Card from "../../components/ui/Card";
//import RevenueChart from "../../components/charts/Revenuechart";
import Collapsible from "../../components/ui/Collapsible";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";

interface HomeProps {
  // Props here
}

export default function Home() {
  const { user } = useAuth();

  const stats = [
    { title: "SAP Setting", subtitle: "username, Server", value: "1,245" },
    // { title: "Orders", subtitle: "Total orders", value: "320" },
    // { title: "Revenue", subtitle: "Total revenue", value: "$12,400" },
    // { title: "Growth", subtitle: "% increase", value: "+12%" },
  ];

  const title = (
    <h1
      style={{
        fontSize: "1.5rem",
        fontWeight: 700,
        marginBottom: "1.5rem",
      }}
    >
      Selamat datang, {user?.name ?? "..."} 👋
    </h1>
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
          {stats.map((s) => (
            <Collapsible
              title={s.title}
              subtitle={s.subtitle}
              defaultOpen={false}
            >
              {s.value}
            </Collapsible>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}
