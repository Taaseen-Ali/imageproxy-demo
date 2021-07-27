import React from "react";
import Fetcher from "./components/Fetcher";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="flex flex-col h-full align-middle">
      <Navbar />
      <Fetcher />
    </div>
  );
}

export default App;
