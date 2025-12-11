import React, { createContext, useState, useContext, ReactNode } from "react";

export interface AppStepListDataRecord {
  Id?: number;
  Name?: string;
  VehicleType?: string;
  Images?: boolean;
  Display?: number;
  Questions?: string;
  Answer?: string;
  Appcolumn?: string;
}

// Define the shape of the context
interface AppStepListContextProps {
  data: AppStepListDataRecord[];
  setData: (newData: AppStepListDataRecord[]) => void;
}

// Create the context
const AppStepListContext = createContext<AppStepListContextProps | undefined>(
  undefined,
);

// Create a provider component
export const AppStepListProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppStepListDataRecord[]>([]);

  return (
    <AppStepListContext.Provider value={{ data, setData }}>
      {children}
    </AppStepListContext.Provider>
  );
};

// Create a hook to use the context
export const useAppStepList = () => {
  const context = useContext(AppStepListContext);
  if (!context) {
    throw new Error(
      "useAppStepList must be used within an AppStepListProvider",
    );
  }
  return context;
};
