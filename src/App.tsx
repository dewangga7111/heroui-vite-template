import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { isSessionValid } from "@/utils/auth";

// Layouts
import DashboardLayout from "@/layouts/dashboard";
import BlankLayout from "@/layouts/blank";

// Module views - Dashboard
import Dashboard from "@/pages/dashboard/views/dashboard";

// Module views - Users
import UsersTable from "@/pages/users/views/users-table";
import UserFormPage from "@/pages/users/views/user-form";

// Module views - Roles
import RolesTable from "@/pages/roles/views/roles-table";
import RoleFormPage from "@/pages/roles/views/role-form";
import RolePermission from "@/pages/roles/views/role-permission";

// Module views - Auth
import Login from "@/pages/auth/views/login";
import Page403 from "@/pages/auth/views/403";

const RequireAuth = () => isSessionValid() ? <Outlet /> : <Navigate to="/auth/login" replace />;
const RequireGuest = () => isSessionValid() ? <Navigate to="/" replace /> : <Outlet />;

function App() {
  return (
    <Routes>
      {/* Protected routes */}
      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/metrics/:metricId" element={<Dashboard />} />

          {/* Users Module */}
          <Route path="/users" element={<UsersTable />} />
          <Route path="/users/add" element={<UserFormPage />} />
          <Route path="/users/edit/:id" element={<UserFormPage isEdit />} />

          {/* Roles Module */}
          <Route path="/roles" element={<RolesTable />} />
          <Route path="/roles/add" element={<RoleFormPage />} />
          <Route path="/roles/edit/:id" element={<RoleFormPage isEdit />} />
          <Route path="/roles/permission/:id" element={<RolePermission />} />
        </Route>
      </Route>

      {/* Guest routes */}
      <Route element={<RequireGuest />}>
        <Route element={<BlankLayout />}>
          <Route path="/auth/login" element={<Login />} />
        </Route>
      </Route>

      {/* Public routes */}
      <Route element={<BlankLayout />}>
        <Route path="/403" element={<Page403 />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="flex min-h-screen items-center justify-center"><h1 className="text-4xl">404 - Page Not Found</h1></div>} />
    </Routes>
  );
}

export default App;
