import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { ReduxProvider } from "@/redux/providers";
import { BreadcrumbProvider } from "@/contexts/breadcrumbs-context";
import { PermissionProvider } from "@/contexts/permission-context";
import { ConfirmationProvider } from "@/contexts/confirmation-context";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <NextThemesProvider attribute="class" defaultTheme="light">
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
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
