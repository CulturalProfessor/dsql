import { useEffect, useRef, useState } from "react";
import { useQueryContext } from "@/utils/context";
import AceEditor from "react-ace";
import Split from "split.js";
import { Play, Database, BarChart } from "lucide-react";
import alasql from "alasql";
import {
  Chart as ChartJS,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { loadCSVData, generateChartData, exportToCSV } from "@/utils/sqlUtils";
import "./SplitEditor.css";
import ace from "ace-builds";
ace.config.set("basePath", "/node_modules/ace-builds/src-noconflict");

import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

interface SplitEditorProps {
  query: string;
  setQuery: (query: string) => void;
}

interface QueryResult {
  [key: string]: any;
}

const SplitEditor: React.FC<SplitEditorProps> = ({ query, setQuery }) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { addQuery } = useQueryContext();
  const [tableName, setTableName] = useState<string>("orders");
  const [resultData, setResultData] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  useEffect(() => {
    Split(["#editor", "#results"], {
      direction: "horizontal",
      sizes: [25, 75],
      gutterSize: 8,
    });

    loadCSVData("/orders.csv", setTableName, setResultData, setLoading);
  }, []);

  const runQuery = (): void => {
    if (!query.trim()) {
      setQueryError("Query cannot be empty.");
      setResultData([]);
      return;
    }

    setLoading(true);
    setQueryError(null);
    const startTime = performance.now();

    setTimeout(() => {
      try {
        addQuery(query);
        const result: QueryResult[] = alasql(query, [resultData]);

        if (!Array.isArray(result)) {
          throw new Error("Unexpected query result format.");
        }

        const endTime = performance.now();
        setExecutionTime(endTime - startTime);
        setRowCount(result.length);
        setResultData(result);
        setChartData(generateChartData(result));
      } catch (error) {
        console.error("SQL Query Error:", error);
        setQueryError(
          error instanceof Error ? error.message : "Unknown error occurred."
        );
        setResultData([]);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="horizontal-split-editor">
      <div ref={editorContainerRef} className="split-container">
        <div id="editor" className="split-panel">
          <div className="editor-header">
            <Play size={18} />
            <h3>SQL Editor</h3>
          </div>
          <AceEditor
            mode="sql"
            theme="monokai"
            name="sql-editor"
            fontSize={14}
            width="100%"
            height="calc(100% - 40px)"
            value={query}
            onChange={setQuery}
            showPrintMargin={false}
            highlightActiveLine
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
          <button onClick={runQuery} className="run-query-button">
            <Play size={16} /> Run Query
          </button>
        </div>

        <div id="results" className="split-panel">
          <div className="results-header">
            <div className="results-header-title">
              <Database size={18} />
              <h3>Query Results (Table: {tableName})</h3>
            </div>
            <button
              onClick={() =>
                setViewMode(viewMode === "table" ? "chart" : "table")
              }
              className="view-toggle-button"
            >
              <BarChart size={18} />{" "}
              {viewMode === "table" ? "View Chart" : "View Table"}
            </button>
            <button
              onClick={() => exportToCSV(resultData)}
              className="export-csv-button"
            >
              Export CSV
            </button>
          </div>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p>Processing...</p>
            </div>
          ) : viewMode === "table" ? (
            <table>
              <thead>
                <tr>
                  {resultData.length > 0 &&
                    Object.keys(resultData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {resultData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{String(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : chartData ? (
            <Line data={chartData} />
          ) : (
            <p>No chart data available, please run a query.</p>
          )}
        </div>
      </div>

      <div className="query-metrics">
        {queryError ? (
          <p className="query-error">Error executing query.</p>
        ) : (
          <p>
            <strong>Execution Time:</strong> {executionTime?.toFixed(2) ?? "0"}{" "}
            ms |<strong> Rows Returned:</strong> {rowCount ?? 0}
          </p>
        )}
      </div>
    </div>
  );
};

export default SplitEditor;
