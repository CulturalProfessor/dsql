import { useState } from "react";
import "./App.css";
import SplitEditor from "./components/Editor/SplitEditor";
import SidePanel from "./components/SidePanel/SidePanel";

function App() {
  const [query, setQuery] = useState(""); 

  return (
    <>
      <SidePanel setQuery={setQuery} /> 
      <SplitEditor query={query} setQuery={setQuery} />
    </>
  );
}

export default App;
