"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  createDefaultTripModePreference,
  createTripModeStorageKey,
  parseTripModePreference,
  resolveSelectedDayId,
  resolveTripClock,
  type TripClockState,
  type TripMode,
  type TripModeConfig,
  type TripModePreference,
} from "./mode-model";

type StorageStatus = "loading" | "ready" | "unavailable";

type TripModeContextValue = {
  config: TripModeConfig;
  mode: TripMode;
  selectedDayId: string;
  clock: TripClockState;
  isManualDay: boolean;
  storageStatus: StorageStatus;
  hydrated: boolean;
  setMode: (mode: TripMode) => void;
  setSelectedDayId: (dayId: string) => void;
  followCurrentDate: () => void;
};

const TripModeContext = createContext<TripModeContextValue | null>(null);

export function TripModeProvider({
  config,
  children,
}: {
  config: TripModeConfig;
  children: ReactNode;
}) {
  const initialClock = useMemo<TripClockState>(
    () => ({
      date: config.startDate,
      relation: "before",
      inferredDayId: config.days[0]?.id ?? "D0",
    }),
    [config.days, config.startDate],
  );
  const [preference, setPreference] = useState<TripModePreference>(
    createDefaultTripModePreference,
  );
  const [clock, setClock] = useState(initialClock);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>("loading");
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    setClock(resolveTripClock(config, new Date()));
    try {
      const stored = parseTripModePreference(
        window.localStorage.getItem(createTripModeStorageKey(config.tripId)),
        config,
      );
      setPreference(stored ?? createDefaultTripModePreference());
      setStorageStatus("ready");
    } catch {
      setStorageStatus("unavailable");
    }
    setHydrated(true);
  }, [config]);

  useEffect(() => {
    const interval = window.setInterval(
      () => setClock(resolveTripClock(config, new Date())),
      60_000,
    );
    return () => window.clearInterval(interval);
  }, [config]);

  const persist = useCallback(
    (next: TripModePreference) => {
      setPreference(next);
      try {
        window.localStorage.setItem(
          createTripModeStorageKey(config.tripId),
          JSON.stringify(next),
        );
        setStorageStatus("ready");
      } catch {
        setStorageStatus("unavailable");
      }
    },
    [config.tripId],
  );

  const setMode = useCallback(
    (mode: TripMode) => persist({ ...preference, mode }),
    [persist, preference],
  );
  const setSelectedDayId = useCallback(
    (dayId: string) => {
      if (!config.days.some((day) => day.id === dayId)) return;
      persist({ ...preference, manualDayId: dayId });
    },
    [config.days, persist, preference],
  );
  const followCurrentDate = useCallback(() => {
    const next = { ...preference };
    delete next.manualDayId;
    persist(next);
  }, [persist, preference]);

  const value = useMemo<TripModeContextValue>(
    () => ({
      config,
      mode: preference.mode,
      selectedDayId: resolveSelectedDayId(
        config,
        clock,
        preference.manualDayId,
      ),
      clock,
      isManualDay: preference.manualDayId !== undefined,
      storageStatus,
      hydrated,
      setMode,
      setSelectedDayId,
      followCurrentDate,
    }),
    [
      clock,
      config,
      followCurrentDate,
      hydrated,
      preference.manualDayId,
      preference.mode,
      setMode,
      setSelectedDayId,
      storageStatus,
    ],
  );

  return (
    <TripModeContext.Provider value={value}>
      {children}
    </TripModeContext.Provider>
  );
}

export function useTripMode(): TripModeContextValue {
  const context = useContext(TripModeContext);
  if (!context)
    throw new Error("useTripMode must be used within TripModeProvider");
  return context;
}
