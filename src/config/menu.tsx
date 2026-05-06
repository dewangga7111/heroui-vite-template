import { Home, Database } from "lucide-react";
import { ReactNode } from "react";

type MenuItem = {
  key?: number;
  label: string;
  path?: string;
  icon?: ReactNode;
  children?: MenuItem[];
};

export const menus: MenuItem[] = [
  {
    key: 1,
    label: "Dashboard",
    icon: <Home size={18} />,
    path: "/",
  },
  {
    label: "Master",
    icon: <Database size={18} />,
    children: [
      {
        key: 2,
        label: "Users",
        path: "/users",
      },
      {
        key: 3,
        label: "Roles",
        path: "/roles",
      },
    ],
  },
];
