import { useEffect } from "react";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Drawer,
  useDisclosure,
  Button,
  DrawerContent,
  DrawerBody,
  Listbox,
  ListboxItem,
  Tooltip,
} from "@heroui/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { useLocation, useNavigate } from "react-router-dom";
import { EllipsisVertical, LogOut, Menu, User } from "lucide-react";
import { MobileView, isMobile } from "react-device-detect";

import SidebarContent from "./sidebar/sidebar-content";
import { useConfirmation } from "@/contexts/confirmation-context";
import { showSuccessToast } from "@/utils/common";
import { ManagedPopover } from "@/components/popover/managed-popover";
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
      <HeroNavbar
        maxWidth="full"
        height="50px"
        className="backdrop-blur-md rounded-bl-lg rounded-br-lg shadow-sm"
        position="sticky"
      >
        <NavbarBrand className="gap-1">
          {isMobile ? (
            <Button isIconOnly variant="light" onPress={onOpen} aria-label="Toggle Menu">
              <Menu size={20} />
            </Button>
          ) : (
            setSidebarOpen && (
              <Tooltip
                content={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                showArrow
                placement="right"
                color="foreground"
                closeDelay={0}
                delay={500}
                size="sm"
              >
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="Toggle Menu"
                >
                  <Menu size={20} />
                </Button>
              </Tooltip>
            )
          )}
          <span className="text-md font-semibold ml-1">{activeLabel}</span>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem className="flex items-center">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="flex items-center">
            <Avatar
              isBordered
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              className="w-7 h-7 text-tiny"
            />
            <div className="mx-2 min-w-[120px]">
              <p className="text-sm font-medium ml-2">{profile?.user?.name ?? "-"}</p>
              <p className="text-xs text-default-500 ml-2">{profile?.role?.name ?? "-"}</p>
            </div>
            <ManagedPopover
              trigger={
                <Button variant="light" isIconOnly>
                  <EllipsisVertical size={20} />
                </Button>
              }
            >
              <Listbox aria-label="User actions" variant="flat">
                <ListboxItem key="profile" startContent={<User size={13} />} onPress={() => {}}>
                  Profile
                </ListboxItem>
                <ListboxItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  startContent={<LogOut size={13} />}
                  onPress={() => {
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
                  Logout
                </ListboxItem>
              </Listbox>
            </ManagedPopover>
          </NavbarItem>
        </NavbarContent>
      </HeroNavbar>

      <MobileView>
        <Drawer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="full"
          placement="left"
          motionProps={{
            variants: {
              enter: { opacity: 1, x: 0 },
              exit: { x: -100, opacity: 0 },
            },
          }}
        >
          <DrawerContent>
            {(onClose) => (
              <DrawerBody>
                <SidebarContent open={true} setOpen={() => {}} onClose={onClose} />
              </DrawerBody>
            )}
          </DrawerContent>
        </Drawer>
      </MobileView>
    </>
  );
};
