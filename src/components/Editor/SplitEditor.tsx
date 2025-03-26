import { useEffect, useRef, useState } from "react";
import { useQueryContext } from "@/context";
import AceEditor from "react-ace";
import Split from "split.js";
import { Play, Database } from "lucide-react";
import "./SplitEditor.css";

import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

const SplitEditor = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) => {
  const editorContainerRef = useRef(null);
  const [data, setData] = useState([]);
  const { addQuery } = useQueryContext();

  useEffect(() => {
    Split(["#editor", "#results"], {
      direction: "horizontal",
      sizes: [50, 50],
      gutterSize: 8,
    });
  }, []);

  const runQuery = () => {
    addQuery(query);
    setData([
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
    ]);
  };

  return (
    <div
      ref={editorContainerRef}
      className="split-container"
      style={{ height: "600px", display: "flex", flexDirection: "row" }}
    >
      <div
        id="editor"
        className="split-panel"
        style={{ width: "50%", padding: "10px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Play size={18} />
          <h3 style={{ margin: 0 }}>SQL Editor</h3>
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
        <button
          onClick={runQuery}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            background: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Play size={16} />
          Run Query
        </button>
      </div>

      <div
        id="results"
        className="split-panel"
        style={{ width: "50%", padding: "10px", background: "#f5f5f5" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Database size={18} />
          <h3 style={{ margin: 0 }}>Query Results</h3>
        </div>
        <table width="100%">
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SplitEditor;
