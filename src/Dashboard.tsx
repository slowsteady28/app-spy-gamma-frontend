import { useState } from "react";
import CallWallChart from "./CallWallChart";
import CallNetOIChart from "./CallNetOIChart";
import CallDurationChart from "./CallDurationChart";
import CallNetGammaChart from "./CallNetGammaChart";

import PutWallChart from "./PutWallChart";
import PutDurationChart from "./PutDurationChart";
import PutNetGammaChart from "./PutNetGammaChart";
import PutNetOIChart from "./PutNetOIChart";

import KGS1CallPutGammaChart from "./KGS1CallPutGammaChart";
import KGS1NetOIChart from "./KGS1NetOIChart";
import KGS1GammaChart from "./KGS1HisGammaChart";
import KGS1DurationChart from "./KGS1DurationChart";

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
        style={{
          width: "200px",
          background: "#2c3e50",
          padding: "1rem",
          color: "white",
        }}
      >
        <h3>Menu</h3>
        <button
          onClick={() => setViewMode("overview")}
          style={{ marginBottom: "1rem", display: "block" }}
        >
          Overview
        </button>
        <button
          onClick={() => setViewMode("dashboard")}
          style={{ marginBottom: "1rem", display: "block" }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setViewMode("commentary")}
          style={{ display: "block" }}
        >
          Commentary
        </button>
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
