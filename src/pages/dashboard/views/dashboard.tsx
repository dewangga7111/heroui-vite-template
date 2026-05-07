import { Card, CardContent, CardHeader } from "@heroui/react";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Welcome to HeroUI Admin</h2>
        </CardHeader>
        <CardContent>
          <p>This is the dashboard homepage.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Users</h2>
        </CardHeader>
        <CardContent>
          <p>Manage your users here.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Roles</h2>
        </CardHeader>
        <CardContent>
          <p>Manage roles and permissions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
