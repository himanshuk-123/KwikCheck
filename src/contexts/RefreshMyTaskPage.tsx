import React, { createContext, useState, useContext, ReactNode } from "react";

type setRefreshProps = boolean;

interface RefreshMyTaskPageContextProps {
  refresh: boolean;
  setRefresh: (data: setRefreshProps) => void;
}

const RefreshMyTaskPageContext = createContext<
  RefreshMyTaskPageContextProps | undefined
>(undefined);

export const RefreshMyTaskPageProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<boolean>(true);

  const setRefresh = (data: setRefreshProps) => {
    setData(data);
  };

  return (
    <RefreshMyTaskPageContext.Provider value={{ refresh: data, setRefresh }}>
      {children}
    </RefreshMyTaskPageContext.Provider>
  );
};

/** @description This context and hook is solely to refresh UI after user rejects remark by changing it through modal on my tasks page */
export const useRefreshMyTaskPage = () => {
  const context = useContext(RefreshMyTaskPageContext);
  if (!context) {
    throw new Error(
      "useRefreshMyTaskPage must be used within an RefreshMyTaskPageProvider"
    );
  }
  return context;
};
