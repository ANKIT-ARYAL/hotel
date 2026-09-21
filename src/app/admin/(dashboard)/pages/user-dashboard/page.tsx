import { getUserDashboardSettings } from "@/app/actions/user-dashboard-settings";
import { UserDashboardEditor } from "./UserDashboardEditor";

export default async function UserDashboardSettingsPage() {
  return <div className="w-full space-y-6 p-6"><UserDashboardEditor initialSettings={await getUserDashboardSettings()} /></div>;
}
