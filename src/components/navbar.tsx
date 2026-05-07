import { useEffect, useState } from "react";
import { Avatar, Drawer, Dropdown, Tooltip, Button } from "@heroui/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { useLocation, useNavigate } from "react-router-dom";
import { EllipsisVertical, LogOut, Menu, User } from "lucide-react";
import { MobileView, isMobile } from "react-device-detect";

import SidebarContent from "./sidebar/sidebar-content";
import { useConfirmation } from "@/contexts/confirmation-context";
import { showSuccessToast } from "@/utils/common";
import { menus } from "@/config/menu";
import { useAppDispatch } from "@/redux/hooks";
import { logout, getProfile } from "@/pages/auth/store/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface NavbarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (val: boolean) => void;
}

function getActiveMenuLabel(pathname: string): string {
  for (const item of menus) {
    if (item.children) {
      const child = item.children.find((c) => c.path && pathname.startsWith(c.path));
      if (child) return child.label;
    } else if (item.path && pathname.startsWith(item.path) && item.path !== "/") {
      return item.label;
    }
  }
  const dashboard = menus.find((m) => m.path === "/");
  return dashboard?.label ?? "Dashboard";
}

export const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const profile = useSelector((state: RootState) => state.auth.profile);
  const [isOpen, setIsOpen] = useState(false);
  const { confirm } = useConfirmation();

  const activeLabel = getActiveMenuLabel(location.pathname);
  const appName = import.meta.env.VITE_WEB_TITLE || "HeroUI";

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    document.title = `${activeLabel} - ${appName}`;
  }, [activeLabel]);

  return (
    <>
      <nav className="w-full backdrop-blur-md rounded-bl-lg rounded-br-lg shadow-sm sticky top-0 z-10 px-3 h-[50px] flex items-center justify-between">
        <div className="flex items-center gap-1">
          {isMobile ? (
            <Button isIconOnly variant="secondary" onPress={() => setIsOpen(true)} aria-label="Toggle Menu">
              <Menu size={20} />
            </Button>
          ) : (
            setSidebarOpen && (
              <Tooltip delay={500} closeDelay={0}>
                <Tooltip.Trigger>
                  <Button
                    isIconOnly
                    variant="ghost"
                    onPress={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle Menu"
                  >
                    <Menu size={20} />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content showArrow placement="right">
                  {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                </Tooltip.Content>
              </Tooltip>
            )
          )}
          <span className="text-md font-semibold ml-1">{activeLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7 ring-2 ring-current">
              <Avatar.Image src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar.Fallback>{profile?.user?.name?.charAt(0) ?? "U"}</Avatar.Fallback>
            </Avatar>
            <div className="min-w-[120px] hidden sm:block">
              <p className="text-sm font-medium">{profile?.user?.name ?? "-"}</p>
              <p className="text-xs text-default-500">{profile?.role?.name ?? "-"}</p>
            </div>
            <Dropdown>
              <Dropdown.Trigger>
                <Button variant="ghost" isIconOnly>
                  <EllipsisVertical size={20} />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Popover placement="bottom end" className="min-w-32">
                <Dropdown.Menu aria-label="User actions">
                  <Dropdown.Item key="profile" onAction={() => { }}>
                    <span className="flex items-center gap-2"><User size={13} />Profile</span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    key="logout"
                    className="text-danger"
                    onAction={() => {
                      confirm({
                        message: "Are you sure you want to logout?",
                        onConfirm: async () => {
                          await dispatch(logout());
                          showSuccessToast("You have been logged out!");
                          navigate("/auth/login");
                        },
                      });
                    }}
                  >
                    <span className="flex items-center gap-2"><LogOut size={13} />Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>
      </nav>

      <MobileView>
        <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Backdrop>
            <Drawer.Content placement="left">
              <Drawer.Body>
                <SidebarContent open={true} setOpen={() => { }} onClose={() => setIsOpen(false)} />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </MobileView>
    </>
  );
};
