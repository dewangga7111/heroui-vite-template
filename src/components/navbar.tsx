
import { useEffect, useState } from "react";
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
  Tooltip
} from "@heroui/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { useLocation, useNavigate } from "react-router-dom";
import { EllipsisVertical, LogOut, Menu, User } from "lucide-react";
import { MobileView, isMobile } from "react-device-detect";

import SidebarContent from "./sidebar/sidebar-content";
import { useConfirmation } from "@/contexts/confirmation-context";
import { showSuccessToast } from "@/utils/common";
import { ManagedPopover } from "@/components/popover/managed-popover";
import constants from "@/utils/constants"

interface NavbarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (val: boolean) => void;
}

export const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { confirm } = useConfirmation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <HeroNavbar
        maxWidth="full"
        height="50px"
        className="backdrop-blur-md rounded-bl-lg rounded-br-lg shadow-sm"
        position="sticky"
      >
        <NavbarBrand>
          {isMobile ? (
            <Button
              isIconOnly
              variant="light"
              onPress={onOpen}
              aria-label="Toggle Menu"
            >
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
        </NavbarBrand>

        {/* Right Section - Actions */}
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
              <p className="text-sm font-medium ml-2">John Doe</p>
              <p className="text-xs text-default-500 ml-2">Admin</p>
            </div>
            <ManagedPopover
              trigger={
                <Button
                  variant="light"
                  isIconOnly
                >
                  <EllipsisVertical size={20} />
                </Button>
              }
            >
              <Listbox aria-label="User actions" variant="flat">
                <ListboxItem
                  key="profile"
                  startContent={<User size={13} />}
                  onPress={() => {
                  }}
                >
                  Profile
                </ListboxItem>
                <ListboxItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  startContent={<LogOut size={13} />}
                  onPress={() => {
                    confirm({
                      message: constants.confirmation.LOGOUT,
                      onConfirm: () => {
                        showSuccessToast(constants.toast.SUCCESS_LOGOUT);
                        navigate(constants.path.LOGIN)
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
              enter: {
                opacity: 1,
                x: 0,
              },
              exit: {
                x: -100,
                opacity: 0,
              },
            },
          }}
        >
          <DrawerContent>
            {(onClose) => (
              <DrawerBody>
                <SidebarContent open={true} setOpen={() => { }} onClose={onClose} />
              </DrawerBody>
            )}
          </DrawerContent>
        </Drawer>
      </MobileView>
    </>
  );
};
