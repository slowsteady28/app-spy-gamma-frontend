import { useEffect, useState } from "react";
import MarketCommentaryCard from "./MarketCommentaryCard";

// ✅ Set up correct API base
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface CommentaryEntry {
  date: string;
  markdown: string;
}

export default function MarketCommentary() {
  const [data, setData] = useState<CommentaryEntry[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/market-commentary`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch commentary:", err));

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
    <div className="container py-4">
      <h2 className="fw-bold mb-4">🧠 SPY Gamma Market Commentary</h2>

      {data.length === 0 ? (
        <p>Loading commentary...</p>
      ) : (
        data.map((entry) => (
          <MarketCommentaryCard
            key={entry.date}
            date={entry.date}
            markdown={entry.markdown}
          />
        ))
      )}

      <p className="text-muted small mt-4">Last updated: {currentTime}</p>
    </div>
  );
}
