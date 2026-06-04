import { RouterProvider, Toast } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { ReduxProvider } from "@/redux/providers";
import { PermissionProvider } from "@/contexts/permission-context";
import { ConfirmationProvider } from "@/contexts/confirmation-context";

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <ReduxProvider>
          <PermissionProvider>
            <ConfirmationProvider>
              <Toast.Provider placement="top end" width={360} />
              {children}
            </ConfirmationProvider>
          </PermissionProvider>
        </ReduxProvider>
      </NextThemesProvider>
    </RouterProvider>
  );
}
