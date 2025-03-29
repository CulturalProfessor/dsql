import { useState } from "react";
import SplitEditor from "./components/Editor/SplitEditor";
import SidePanel from "./components/SidePanel/SidePanel";
import CsvUploader from "./components/Uploader/Uploader";
import "./App.css";

function App() {
  const queries = [`SELECT * FROM orders;`, `SELECT * FROM products;`];

  const csvPaths = ["/orders.csv", "/products.csv"];

  const tableNames = ["orders", "products"];
  const [queryIndex, setQueryIndex] = useState(0);
  const [query, setQuery] = useState(queries[queryIndex]);
  const [csvPath, setCsvPath] = useState(csvPaths[queryIndex]);
  const [tableName, setTableName] = useState(tableNames[queryIndex]);
  const toggleQueryAndCSV = () => {
    const newIndex = (queryIndex + 1) % queries.length;
    setQueryIndex(newIndex);
    setQuery(queries[newIndex]);
    setCsvPath(csvPaths[newIndex]);
    setTableName(tableNames[newIndex]);
  };

  return (
    <>
      <div className="top-bar">
        <SidePanel setQuery={setQuery} />
        <button className="toggle-button" onClick={toggleQueryAndCSV}>
          {tableName === "orders" ? "Switch to Products" : "Switch to Orders"}
        </button>

        <div className="title">SQL Playground</div>
        <CsvUploader />
      </div>
      <SplitEditor
        query={query}
        setQuery={setQuery}
        csvPath={csvPath}
        tableName={tableName}
      />
    </>
  );
}

export default App;
