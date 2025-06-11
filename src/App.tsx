import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./AppZoom.css"; // Import the CSS file

function App() {
  return (
    <div className="app-zoom-wrapper">
      <Dashboard />
    </div>
  );
}

export default App;
