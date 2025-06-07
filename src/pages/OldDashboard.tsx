import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

import CallWallChart from "../components/walls/CW1/CW1WallChart";
import CallNetOIChart from "../components/walls/CW1/CW1NetOIChart";
import CallDurationChart from "../components/walls/CW1/CW1DurationChart";
import CallNetGammaChart from "../components/walls/CW1/CW1NetGammaChart";

import PutWallChart from "../components/walls/Put/PW1WallChart";
import PutDurationChart from "../components/walls/Put/PW1DurationChart";
import PutNetGammaChart from "../components/walls/Put/PW1NetGammaChart";
import PutNetOIChart from "../components/walls/Put/PW1NetOIChart";

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
    <MainLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>SPY Options Dashboard</h2>
        <div>
          <label htmlFor="lookback-select" style={{ marginRight: "0.5rem" }}>
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

      {/* Conditional Views */}
      {viewMode === "commentary" && <MarketCommentary />}
      {viewMode === "overview" && <OverView />}
      {viewMode === "dashboard" && (
        <>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <CallWallChart
              lookback={lookback}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
            <PutWallChart
              lookback={lookback}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
            <KGS1GammaChart lookback={lookback} />
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <CallNetOIChart
              lookback={lookback}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
            <PutNetOIChart
              lookback={lookback}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
            <KGS1NetOIChart lookback={lookback} />
          </div>

          {/* Row 3 */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <CallNetGammaChart lookback={lookback} />
            <PutNetGammaChart lookback={lookback} />
            <KGS1CallPutGammaChart lookback={lookback} />
          </div>

          {/* Row 4 */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <CallDurationChart lookback={lookback} />
            <PutDurationChart lookback={lookback} />
            <KGS1DurationChart lookback={lookback} />
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default Dashboard;
