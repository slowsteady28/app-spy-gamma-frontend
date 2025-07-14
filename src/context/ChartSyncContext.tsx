import React, { createContext, useContext, useState, ReactNode } from "react";

// Define context type
interface ChartSyncContextType {
  hoveredDate: string | null;
  setHoveredDate: (date: string | null) => void;
}

// Create context
const ChartSyncContext = createContext<ChartSyncContextType | undefined>(
  undefined
);

// Provider component
export function ChartSyncProvider({ children }: { children: ReactNode }) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  return (
    <ChartSyncContext.Provider value={{ hoveredDate, setHoveredDate }}>
      {children}
    </ChartSyncContext.Provider>
  );
}

// Hook to use the context
export function useChartSync() {
  const context = useContext(ChartSyncContext);
  if (context === undefined) {
    console.warn("useChartSync must be used within a ChartSyncProvider");
  }
  return context;
}
