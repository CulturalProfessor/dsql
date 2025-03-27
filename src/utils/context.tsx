import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

interface QueryContextType {
  pastQueries: string[];
  addQuery: (query: string) => void;
}

const QueryContext = createContext<QueryContextType>({
  pastQueries: [],
  addQuery: () => {},
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [pastQueries, setPastQueries] = useState<string[]>(() => {
    const savedQueries = localStorage.getItem("pastQueries");
    return savedQueries ? JSON.parse(savedQueries) : [];
  });

  const addQuery = (query: string) => {
    const updatedQueries = [query, ...pastQueries.slice(0, 19)];
    setPastQueries(updatedQueries);
    localStorage.setItem("pastQueries", JSON.stringify(updatedQueries));
  };

  useEffect(() => {
    localStorage.setItem("pastQueries", JSON.stringify(pastQueries));
  }, [pastQueries]);

  const contextValue = useMemo(
    () => ({ pastQueries, addQuery }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pastQueries]
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
