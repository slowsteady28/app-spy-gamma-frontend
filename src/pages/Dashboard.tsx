import { useState } from "react";
import CallWallChart from "../components/walls/CW1/CallWallChart";
import CallNetOIChart from "../components/walls/CW1/CallNetOIChart";
import CallDurationChart from "../components/walls/CW1/CallDurationChart";
import CallNetGammaChart from "../components/walls/CW1/CallNetGammaChart";

import PutWallChart from "../components/walls/Put/PutWallChart";
import PutDurationChart from "../components/walls/Put/PutDurationChart";
import PutNetGammaChart from "../components/walls/Put/PutNetGammaChart";
import PutNetOIChart from "../components/walls/Put/PutNetOIChart";

import KGS1CallPutGammaChart from "../components/walls/KeyGamma/KGS1CallPutGammaChart";
import KGS1NetOIChart from "../components/walls/KeyGamma/KGS1NetOIChart";
import KGS1GammaChart from "../components/walls/KeyGamma/KGS1HisGammaChart";
import KGS1DurationChart from "../components/walls/KeyGamma/KGS1DurationChart";

import MarketCommentary from "./MarketCommentary";
import OverView from "./Overview";

function Dashboard() {
  const [selectedRange, setSelectedRange] = useState<[number, number] | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lookback, setLookback] = useState<number>(25);
  const [viewMode, setViewMode] = useState<
    "overview" | "dashboard" | "commentary"
  >("dashboard");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white"
        style={{ width: "200px", height: "100vh" }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-4">SPY Gamma</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <button
              className="nav-link text-white"
              onClick={() => setViewMode("overview")}
            >
              Overview
            </button>
          </li>
          <li>
            <button
              className="nav-link text-white"
              onClick={() => setViewMode("dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className="nav-link text-white"
              onClick={() => setViewMode("commentary")}
            >
              Commentary
            </button>
          </li>
        </ul>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {viewMode === "commentary" && <MarketCommentary />}
        {viewMode === "overview" && <OverView />}
        {viewMode === "dashboard" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>SPY Options Dashboard</h2>
              <div>
                <label
                  htmlFor="lookback-select"
                  style={{ marginRight: "0.5rem" }}
                >
                  Lookback:
                </label>
                <select
                  id="lookback-select"
                  value={lookback}
                  onChange={(e) => setLookback(Number(e.target.value))}
                >
                  <option value={25}>25 days</option>
                  <option value={50}>50 days</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ flex: 1 }}>
                <CallWallChart
                  lookback={lookback}
                  selectedRange={selectedRange}
                  setSelectedRange={setSelectedRange}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </div>
              <div style={{ flex: 1 }}>
                <PutWallChart
                  lookback={lookback}
                  selectedRange={selectedRange}
                  setSelectedRange={setSelectedRange}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </div>
              <div style={{ flex: 1 }}>
                <KGS1GammaChart lookback={lookback} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ flex: 1 }}>
                <CallNetOIChart
                  lookback={lookback}
                  selectedRange={selectedRange}
                  setSelectedRange={setSelectedRange}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </div>
              <div style={{ flex: 1 }}>
                <PutNetOIChart
                  lookback={lookback}
                  selectedRange={selectedRange}
                  setSelectedRange={setSelectedRange}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </div>
              <div style={{ flex: 1 }}>
                <KGS1NetOIChart lookback={lookback} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ flex: 1 }}>
                <CallNetGammaChart lookback={lookback} />
              </div>
              <div style={{ flex: 1 }}>
                <PutNetGammaChart lookback={lookback} />
              </div>
              <div style={{ flex: 1 }}>
                <KGS1CallPutGammaChart lookback={lookback} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ flex: 1 }}>
                <CallDurationChart lookback={lookback} />
              </div>
              <div style={{ flex: 1 }}>
                <PutDurationChart lookback={lookback} />
              </div>
              <div style={{ flex: 1 }}>
                <KGS1DurationChart lookback={lookback} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
