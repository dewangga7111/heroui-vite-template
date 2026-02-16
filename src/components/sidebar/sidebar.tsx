
import { BrowserView } from "react-device-detect";
import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import SidebarContent from "./sidebar-content";

interface SidebarProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-16 h-screen" />; // placeholder width to prevent layout shift
  }

  return (
    <BrowserView>
      <Card
        className={`h-screen sticky top-0 transition-all duration-300 rounded-none 
          ${open ? "w-64" : "w-16"} flex flex-col`}
        shadow="sm"
      >
        <SidebarContent open={open} setOpen={setOpen} />
      </Card>
    </BrowserView>
  );
}
