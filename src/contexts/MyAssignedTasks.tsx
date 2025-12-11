import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context
interface MyAssignedTasksContextProps {
  data: any[];
  setData: (newData: any[]) => void;
}

// Create the context
const MyAssignedTasksContext = createContext<
  MyAssignedTasksContextProps | undefined
>(undefined);

// Create a provider component
export const MyAssignedTasksProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<any[]>([]);

  return (
    <MyAssignedTasksContext.Provider value={{ data, setData }}>
      {children}
    </MyAssignedTasksContext.Provider>
  );
};

export const useMyAssignedTasks = () => {
  const context = useContext(MyAssignedTasksContext);
  if (!context) {
    throw new Error(
      "useMyAssignedTasks must be used within an MyAssignedTasksProvider"
    );
  }
  return context;
};
