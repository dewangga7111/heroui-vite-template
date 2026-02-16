import { Route, Routes } from "react-router-dom";

// Layouts
import DashboardLayout from "@/shared/layouts/dashboard";
import BlankLayout from "@/shared/layouts/blank";

// Module views - Dashboard
import Dashboard from "@/modules/dashboard/views/dashboard";

// Module views - Users
import UsersTable from "@/modules/users/views/users-table";
import UserAdd from "@/modules/users/views/user-add";
import UserEdit from "@/modules/users/views/user-edit";

// Module views - Roles
import RolesTable from "@/modules/roles/views/roles-table";
import RoleAdd from "@/modules/roles/views/role-add";
import RoleEdit from "@/modules/roles/views/role-edit";
import RolePermission from "@/modules/roles/views/role-permission";

// Module views - Auth
import Login from "@/modules/auth/views/login";
import Page403 from "@/modules/auth/views/403";

function App() {
  return (
    <Routes>
      {/* Dashboard Routes with Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />

        {/* Users Module */}
        <Route path="/users" element={<UsersTable />} />
        <Route path="/users/add" element={<UserAdd />} />
        <Route path="/users/edit/:id" element={<UserEdit />} />

        {/* Roles Module */}
        <Route path="/roles" element={<RolesTable />} />
        <Route path="/roles/add" element={<RoleAdd />} />
        <Route path="/roles/edit/:id" element={<RoleEdit />} />
        <Route path="/roles/permission/:id" element={<RolePermission />} />
      </Route>

      {/* Auth Routes with Blank Layout */}
      <Route element={<BlankLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/403" element={<Page403 />} />
      </Route>

      {/* 404 - Catch all */}
      <Route path="*" element={<div className="flex min-h-screen items-center justify-center"><h1 className="text-4xl">404 - Page Not Found</h1></div>} />
    </Routes>
  );
}

export default App;
