import Card from "../components/ui/Card";

export default function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Card
          value="Settings page content goes here. You can add forms, toggles, or any       other settings-related components." >
        </Card>
      </div>
    </div>
  );
}
