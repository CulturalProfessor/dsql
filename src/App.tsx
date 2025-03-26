import { useState } from "react";
import SplitEditor from "./components/Editor/SplitEditor";
import SidePanel from "./components/SidePanel/SidePanel";
import CsvUploader from "./components/Uploader/Uploader";
import "./App.css";

function App() {
  const [query, setQuery] = useState(`SELECT * FROM orders;`);

  return (
    <>
      <div className="top-bar">
        <SidePanel setQuery={setQuery} />
        <div className="title">SQL Playground</div>
        <CsvUploader />
      </div>
      <SplitEditor query={query} setQuery={setQuery} />
    </>
  );
}

export default App;
