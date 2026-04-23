import { usePermission } from "@/contexts/permission-context";

import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This context is just a placeholder (no values exposed)
const RouteGuardContext = createContext<boolean | undefined>(undefined);

export const RouteGuardProvider = ({
  children,
  pageId,
  access,
}: {
  children: React.ReactNode;
  pageId: string;
  access: string;
}) => {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  useEffect(() => {
    if (!pageId) return;

    const hasAccess = hasPermission(pageId, access);

    if (!hasAccess) {
      console.warn(`🚫 No ${access} permission for: ${pageId}`);
      navigate("/403");
    }
  }, [pageId, access, hasPermission, navigate]);

  return (
    <RouteGuardContext.Provider value={true}>
      {children}
    </RouteGuardContext.Provider>
  );
};
