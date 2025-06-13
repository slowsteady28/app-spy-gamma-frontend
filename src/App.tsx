import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./AppZoom.css"; // Import the CSS file
import ScrollToTopButton from "./components/ScrollToTopButton";

function App() {
  return (
    <>
      <div className="app-zoom-wrapper">
        <Dashboard />
      </div>
      <ScrollToTopButton />
    </>
  );
}

export default App;
