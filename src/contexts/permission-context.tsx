import { createContext, useContext } from "react";
import { useAppSelector } from "@/redux/hooks";
import { ProfileAccess } from "@/utils/auth";

type PermissionContextType = {
  permissions: ProfileAccess[];
  canRead: (path: string) => boolean;
  canCreate: (path: string) => boolean;
  canUpdate: (path: string) => boolean;
  canDelete: (path: string) => boolean;
  hasPermission: (menuKey: number | string, action: string) => boolean;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const profile = useAppSelector((s) => s.auth.profile);
  const permissions = profile?.role?.access ?? [];

  // allow everything when profile not loaded yet, or when access list is empty (admin/mock)
  const noProfile = !profile || permissions.length === 0;

  const find = (path: string) => permissions.find((p) => p.path === path);

  const canRead = (path: string) => noProfile || (find(path)?.is_read ?? false);
  const canCreate = (path: string) => noProfile || (find(path)?.is_create ?? false);
  const canUpdate = (path: string) => noProfile || (find(path)?.is_update ?? false);
  const canDelete = (path: string) => noProfile || (find(path)?.is_delete ?? false);

  const hasPermission = (menuKey: number | string, action: string) => {
    if (noProfile) return true;
    const access = permissions.find((p) => p.id === Number(menuKey));
    if (!access) return false;
    if (action === "read") return access.is_read;
    if (action === "create") return access.is_create;
    if (action === "update") return access.is_update;
    if (action === "delete") return access.is_delete;
    return false;
  };

  return (
    <PermissionContext.Provider value={{ permissions, canRead, canCreate, canUpdate, canDelete, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermission must be used within PermissionProvider");
  return ctx;
};
