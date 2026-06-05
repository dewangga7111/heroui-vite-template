import { Home, Database, Briefcase, Star, Users, Building, AlertTriangle, ShieldAlert } from "lucide-react";
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
    label: "Executive Summary",
    icon: <Home size={18} />,
    path: "/",
  },
  {
    key: 101,
    label: "Total Assets",
    icon: <Briefcase size={18} />,
    path: "/metrics/total-assets",
  },
  {
    key: 102,
    label: "Nasabah Prioritas",
    icon: <Star size={18} />,
    path: "/metrics/priority-customers",
  },
  {
    key: 103,
    label: "Nasabah Biasa",
    icon: <Users size={18} />,
    path: "/metrics/regular-customers",
  },
  {
    key: 104,
    label: "Wholesale Loans",
    icon: <Building size={18} />,
    path: "/metrics/wholesale-loans",
  },
  {
    key: 105,
    label: "NPL",
    icon: <AlertTriangle size={18} />,
    path: "/metrics/npl",
  },
  {
    key: 106,
    label: "Fraud Alerts",
    icon: <ShieldAlert size={18} />,
    path: "/metrics/fraud-alerts",
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
