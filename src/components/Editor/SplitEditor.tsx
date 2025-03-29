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
import { FixedSizeList as List } from "react-window";
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
  csvPath: string;
  tableName: string;
}

interface QueryResult {
  [key: string]: any;
}

interface RowRendererProps {
  index: number;
  style: React.CSSProperties;
  data: QueryResult[];
  rowsPerPage: number;
}

const RowRenderer: React.FC<RowRendererProps & { currentPage: number }> = ({
  index,
  style,
  data,
  currentPage,
  rowsPerPage,
}) => {
  const row = data[index];
  const rowNumber = currentPage * rowsPerPage + index + 1;

  return (
    <div style={{ ...style, display: "flex" }} className="table-row">
      <div className="table-cell row-number" style={{ fontWeight: "bold" }}>
        {rowNumber}
      </div>
      {Object.keys(data[0] || {}).map((key) => (
        <div key={key} className="table-cell" title={String(row[key])}>
          <span className="cell-content">{String(row[key])}</span>
        </div>
      ))}
    </div>
  );
};

const SplitEditor: React.FC<SplitEditorProps> = ({
  query,
  setQuery,
  csvPath,
  tableName,
}) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { addQuery, csvData } = useQueryContext();
  const [resultData, setResultData] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 50;
  const [paginatedData, setPaginatedData] = useState<QueryResult[]>(
    resultData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
  );

  useEffect(() => {
    Split(["#editor", "#results"], {
      direction: "horizontal",
      sizes: [25, 75],
      gutterSize: 8,
    });

    loadCSVData(csvPath, setResultData, setLoading, tableName);
    setExecutionTime(null);
    setRowCount(null);
  }, [csvPath]);

  useEffect(() => {
    setPaginatedData(
      resultData.slice(
        currentPage * rowsPerPage,
        (currentPage + 1) * rowsPerPage
      )
    );
  }, [currentPage, resultData]);

  useEffect(() => {
    if (csvData.length > 0) {
      Object.keys(alasql.tables).forEach((table) => {
        alasql(`DROP TABLE IF EXISTS ${table}`);
      });

      const headers = Object.keys(csvData[0]);
      const createTableQuery = `CREATE TABLE ${tableName} (${headers
        .map((h) => `${h} STRING`)
        .join(", ")})`;
      alasql(createTableQuery);

      csvData.forEach((row) => {
        const values = headers
          .map((h) => `'${String(row[h] ?? "").replace(/'/g, "''")}'`)
          .join(", ");
        alasql(`INSERT INTO ${tableName} VALUES (${values})`);
      });

      setResultData(csvData);
      setLoading(false);
    }
  }, [csvData, csvPath]);

  const runQuery = (): void => {
    if (!query.trim()) {
      setQueryError("Query cannot be empty.");
      setResultData([]);
      return;
    }

    setLoading(true);
    setQueryError(null);

    setTimeout(() => {
      try {
        addQuery(query);

        const startTime = performance.now();
        const result: QueryResult[] = alasql(query, [resultData]);
        const endTime = performance.now();

        if (!Array.isArray(result)) {
          throw new Error("Unexpected query result format.");
        }

        setExecutionTime(endTime - startTime);
        setRowCount(result.length);
        setResultData(result);
        setChartData(generateChartData(result));
        setPaginatedData(
          result.slice(
            currentPage * rowsPerPage,
            (currentPage + 1) * rowsPerPage
          )
        );
      } catch (error) {
        console.error("SQL Query Error:", error);
        setQueryError(
          error instanceof Error ? error.message : "Unknown error occurred."
        );
        setResultData([]);
      }
      setLoading(false);
    });
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

          {queryError ? (
            <div className="error-message">
              <p>
                <strong>Error:</strong> {queryError}
              </p>
            </div>
          ) : loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p>Processing...</p>
            </div>
          ) : viewMode === "table" ? (
            resultData.length > 0 ? (
              <div className="table-container">
                <div className="table-header">
                  <div className="table-cell header-cell">#</div>
                  {Object.keys(resultData[0] || {}).map((key) => (
                    <div
                      key={key}
                      className="table-cell header-cell"
                      title={key}
                    >
                      <span className="cell-content">{key}</span>
                    </div>
                  ))}
                </div>

                <List
                  height={600}
                  itemCount={paginatedData.length}
                  itemSize={35}
                  width="100%"
                  itemData={paginatedData}
                  className="table-list"
                >
                  {({ index, style }) => (
                    <RowRenderer
                      index={index}
                      style={style}
                      data={paginatedData}
                      currentPage={currentPage}
                      rowsPerPage={rowsPerPage}
                    />
                  )}
                </List>

                <div className="pagination-controls">
                  <button
                    disabled={currentPage === 0}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 0))
                    }
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage + 1} of{" "}
                    {Math.ceil(resultData.length / rowsPerPage)}
                  </span>
                  <button
                    disabled={
                      (currentPage + 1) * rowsPerPage >= resultData.length
                    }
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(resultData.length / rowsPerPage) - 1
                        )
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p>No data returned from the query.</p>
            )
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
