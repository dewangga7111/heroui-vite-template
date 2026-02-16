
import { useEffect, useState } from "react";
import { ScrollShadow, Image } from "@heroui/react";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { isMobile } from "react-device-detect";

import SidebarMenuItem from "./sidebar-item";
import { menus } from "@/config/menu";
import { isMenuActive } from "./utils";
import { usePermission } from "@/contexts/permission-context";
import constants from "@/utils/constants";

interface SidebarContentProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  onClose?: () => void;
}

export default function SidebarContent({ open, onClose }: SidebarContentProps) {
  const [mounted, setMounted] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const pathname = location.pathname;
  const { theme } = useTheme();
  const { hasPermission } = usePermission();
  const appName = import.meta.env.VITE_WEB_TITLE || "MyApp";

  useEffect(() => setMounted(true), []);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    menus.forEach((item) => {
      if (item.children && isMenuActive(item, pathname)) {
        newOpenMenus[item.key] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
  }, [pathname]);

  const shouldShowMenu = (item: any): boolean => {
    if (item.key && hasPermission(item.key, constants.permission.READ)) return true;
    if (item.children && item.children.some((child: any) => shouldShowMenu(child)))
      return true;
    return false;
  };

  if (!mounted) return null;

  return (
    <>
      {/* Header */}
      {isMobile ? (
        <div className="flex items-center justify-center p-3">
          {open && <span className="font-bold">{appName}</span>}
        </div>
      ) : (
        <div className="flex items-center justify-start p-3">
          <span className="font-bold"><Image src="/vite.svg" alt="Logo" height={50} /></span>
        </div>
      )}

      {/* Menu */}
      <ScrollShadow aria-label="Sidebar menu" className="flex-grow mt-3">
        {menus
          .filter((item) => shouldShowMenu(item))
          .map((item) => (
            <SidebarMenuItem
              key={item.key || item.label}
              item={{
                ...item,
                children: item.children?.filter((child) => shouldShowMenu(child)),
              }}
              pathname={pathname}
              theme={theme}
              open={open}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              mounted={mounted}
              onClose={onClose}
            />
          ))}
      </ScrollShadow>
    </>
  );
}
