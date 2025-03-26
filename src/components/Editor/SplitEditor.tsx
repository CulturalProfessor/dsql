import { useEffect, useRef, useState } from "react";
import { useQueryContext } from "@/utils/context";
import AceEditor from "react-ace";
import Split from "split.js";
import { Play, Database } from "lucide-react";
import alasql from "alasql";
import Papa from "papaparse";
import "./SplitEditor.css";

import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

interface SplitEditorProps {
  query: string;
  setQuery: (query: string) => void;
  data: Record<string, any>[];
}

const SplitEditor: React.FC<SplitEditorProps> = ({ query, setQuery }) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { addQuery, csvData } = useQueryContext();
  const [resultData, setResultData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  useEffect(() => {
    Split(["#editor", "#results"], {
      direction: "horizontal",
      sizes: [25, 75],
      gutterSize: 8,
    });
    fetch("/orders.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setResultData(result.data);
            setLoading(false);
          },
        });
      })
      .catch((error) => console.error("Error loading default CSV:", error));
  }, []);

  const runQuery = () => {
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
        const result = alasql(query, [csvData]);

        if (!Array.isArray(result)) {
          throw new Error("Unexpected query result format.");
        }

        const endTime = performance.now();
        setExecutionTime(endTime - startTime);
        setRowCount(result.length);
        setResultData(result);
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
            <Play size={16} />
            Run Query
          </button>
        </div>

        <div id="results" className="split-panel">
          <div className="results-header">
            <Database size={18} />
            <h3>Query Results</h3>
          </div>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p>Processing...</p>
            </div>
          ) : (
            <table width="100%" cellPadding="5" cellSpacing="0">
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
          )}
        </div>
      </div>

      <div className="query-metrics">
        {queryError ? (
          <p className="query-error">Error executing query.</p>
        ) : (
          <p>
            <strong>Execution Time:</strong>{" "}
            {executionTime ? executionTime.toFixed(2) : "0"} ms |
            <strong> Rows Returned:</strong> {rowCount !== null ? rowCount : 0}
          </p>
        )}
      </div>
    </div>
  );
};

export default SplitEditor;
