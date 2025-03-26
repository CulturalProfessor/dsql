import { Provider } from "@/components/ui/provider";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryProvider } from "./utils/context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </Provider>
  </React.StrictMode>
);
