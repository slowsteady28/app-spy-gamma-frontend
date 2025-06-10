import { useEffect, useState } from "react";
import MarketCommentaryCard from "./MarketCommentaryCard";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface CommentaryEntry {
  date: string;
  markdown: string;
}

export default function MarketCommentary() {
  const [data, setData] = useState<CommentaryEntry[]>([]);
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/market-commentary`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch commentary:", err))
      .finally(() => setLoading(false));

    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setCurrentTime(formatted);
  }, []);

  return (
    <div className="container py-4 px-2 px-md-4">
      {/* Dashboard-style header */}
      <div className="row mb-4 align-items-end">
        <div className="col-12 col-md-8">
          <h2 className="mb-1 text-body-emphasis">
            🧠 SPY Gamma Market Commentary
          </h2>
          <h5 className="text-body-tertiary fw-semibold mb-0">
            Latest insights and analysis
          </h5>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
          <span className="text-muted small">Last updated: {currentTime}</span>
        </div>
      </div>

      {/* Commentary cards in a responsive grid */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm p-4 text-center bg-body-emphasis">
              <p className="mb-0">Loading commentary...</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm p-4 text-center bg-body-emphasis">
              <p className="mb-0">No commentary available.</p>
            </div>
          </div>
        ) : (
          data.map((entry) => (
            <div
              className="col-12 col-sm-12 col-md-6 col-xl-6 d-flex"
              key={entry.date}
            >
              <MarketCommentaryCard
                date={entry.date}
                markdown={entry.markdown}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
