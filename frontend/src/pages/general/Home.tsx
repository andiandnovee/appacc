import { FC, ReactNode, ReactElement } from 'react'
import Card from "../../components/ui/Card";
import RevenueChart from "../../components/charts/Revenuechart";
import { useAuth } from "../../hooks/useAuth";

interface HomeProps {
  // Props here
}


export default function Home() {
  const { user } = useAuth();

  const stats = [
    { title: "Users",   subtitle: "Total users",   value: "1,245"   },
    { title: "Orders",  subtitle: "Total orders",  value: "320"     },
    { title: "Revenue", subtitle: "Total revenue", value: "$12,400" },
    { title: "Growth",  subtitle: "% increase",    value: "+12%"    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Selamat datang, {user?.name ?? "..."} 👋
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
        {stats.map((s) => (
          <Card key={s.title} variant="outlined">
            <Card.Header title={s.title} subtitle={s.subtitle} />
            <Card.Body>
              <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.value}</p>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <RevenueChart />
      </div>
    </div>
  );
}