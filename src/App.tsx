import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div
      style={{
        transform: "scale(0.67)",
        transformOrigin: "top left",
        width: "149.25vw", // 100vw / 0.67
        height: "149.25vh", // 100vh / 0.67
        overflow: "visible",
        position: "relative",
        background: "#f8f9fa",
      }}
    >
      <Dashboard />
    </div>
  );
}

export default App;
