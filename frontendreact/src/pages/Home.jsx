import Card from "../components/ui/Card"
import RevenueChart from "../components/charts/RevenueChart"
export default function Home() {
  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <Card title="Users" value="1,245" />

        <Card title="Orders" value="320" />

        <Card title="Revenue" value="$12,400" />

        <Card title="Growth" value="+12%" />

      </div>

    <div className="mt-8">
    <RevenueChart />
  </div>

    </div>

  )
}