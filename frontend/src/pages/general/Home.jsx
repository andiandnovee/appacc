import Card from "../../components/ui/Card";
import RevenueChart from "../../components/charts/Revenuechart";
export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
        <Card.Header title="Users" subtitle="Total number of users" />
        <Card.Body>
          <p className="text-2xl font-bold">1,245</p>
        </Card.Body>

        <Card.Header title="Orders" subtitle="Total number of orders" />
        <Card.Body>
          <p className="text-2xl font-bold">320</p>
        </Card.Body>

        <Card.Header title="Revenue" subtitle="Total revenue generated" />
        <Card.Body>
          <p className="text-2xl font-bold">$12,400</p>
        </Card.Body>

        <Card.Header title="Growth" subtitle="Percentage increase" />
        <Card.Body>
          <p className="text-2xl font-bold">+12%</p>
        </Card.Body>
      </div>

      <div className="mt-8">
        <RevenueChart />
      </div>

      <div className="bg-red-500 dark:bg-blue-500 p-10">TEST</div>
    </div>
  );
}
