import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Card.Header
          title="Profile Settings"
          subtitle="Manage your profile information"
        />
        <Card.Body>
          <p>
            Here you can update your profile information, change your password,
            and manage other personal settings.
          </p>
        </Card.Body>
        <Card.Footer align="left">
          <Button variant="primary">Edit Profile</Button>
        </Card.Footer>
      </div>
    </div>
  );
}
