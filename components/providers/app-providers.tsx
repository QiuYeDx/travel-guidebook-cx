"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { TripModeConfig } from "@/features/trip/mode-model";
import { TripModeProvider } from "@/features/trip/trip-mode-provider";

interface AppProvidersProps {
  children: ReactNode;
  tripModeConfig: TripModeConfig;
}

export function AppProviders({ children, tripModeConfig }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TripModeProvider config={tripModeConfig}>
        {children}
        <Toaster />
      </TripModeProvider>
    </ThemeProvider>
  );
}
