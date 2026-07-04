import React from "react";
import { IDEProvider } from "./ide/IDEContext";
import IDE from "./components/IDE";

function App() {
  return (
    <IDEProvider>
      <IDE />
    </IDEProvider>
  );
}

export default App;
