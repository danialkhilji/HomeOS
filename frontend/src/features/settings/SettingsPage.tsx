import { useThemeStore } from "../../stores/themeStore";
import { PageHeader, Card, Button, EmptyState } from "../../components";

export default function SettingsPage() {
  const { theme, toggle } = useThemeStore();

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="space-y-4">
        <Card title="Appearance">
          <div className="flex items-center justify-between">
            <span className="text-lg">Dark Mode</span>
            <Button onClick={toggle}>
              {theme === "dark" ? "On" : "Off"}
            </Button>
          </div>
        </Card>

        <Card title="Household Members">
          <EmptyState
            message="No members yet. Add your first member."
            action={<Button onClick={() => {}}>Add Member</Button>}
          />
        </Card>
      </div>
    </div>
  );
}
