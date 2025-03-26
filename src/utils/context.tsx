import { ReactNode, createContext, useContext, useMemo, useState } from "react";

interface QueryContextType {
  pastQueries: string[];
  addQuery: (query: string) => void;
  csvData: any[]; // Store parsed CSV data
  setCsvData: (data: any[]) => void;
}

const QueryContext = createContext<QueryContextType>({
  pastQueries: [],
  addQuery: () => {},
  csvData: [],
  setCsvData: () => {},
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [pastQueries, setPastQueries] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);

  const addQuery = (query: string) => {
    setPastQueries((prevQueries) => [query, ...prevQueries.slice(0, 19)]);
  };

  const contextValue = useMemo(
    () => ({ pastQueries, addQuery, csvData, setCsvData }),
    [pastQueries, csvData]
  );

  return (
    <QueryContext.Provider value={contextValue}>
      {children}
    </QueryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useQueryContext = () => {
  return useContext(QueryContext);
};
