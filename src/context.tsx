import { ReactNode, createContext, useContext, useState } from "react";

interface QueryContextType {
  pastQueries: string[];
  addQuery: (query: string) => void;
}

const QueryContext = createContext<QueryContextType>({
  pastQueries: [],
  addQuery: () => {},
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [pastQueries, setPastQueries] = useState<string[]>([]);

  const addQuery = (query: string) => {
    setPastQueries((prevQueries) => [query, ...prevQueries]);
  };

  return (
    <QueryContext.Provider value={{ pastQueries, addQuery }}>
      {children}
    </QueryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useQueryContext = () => {
  return useContext(QueryContext);
};
