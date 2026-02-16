import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";

import { ReduxProvider } from "@/redux/providers";
import { BreadcrumbProvider } from "@/shared/contexts/breadcrumbs-context";
import { PermissionProvider } from "@/shared/contexts/permission-context";
import { ConfirmationProvider } from "@/shared/contexts/confirmation-context";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ReduxProvider>
        <BreadcrumbProvider>
          <PermissionProvider>
            <ConfirmationProvider>
              <ToastProvider />
              {children}
            </ConfirmationProvider>
          </PermissionProvider>
        </BreadcrumbProvider>
      </ReduxProvider>
    </HeroUIProvider>
  );
}
