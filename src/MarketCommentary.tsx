import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // enables raw HTML rendering

const apiBaseUrl = import.meta.env.VITE_API_URL;

interface CommentaryEntry {
  date: string;
  markdown: string;
  images: { src: string; caption: string }[];
}

export default function MarketCommentary() {
  const [data, setData] = useState<CommentaryEntry[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    fetch("${apiBaseUrl}/api/market-commentary")
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
    <div
      style={{
        padding: "1rem",
        color: "#ffffff",
        backgroundColor: "#1f2937",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "1.75rem",
          marginBottom: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Market Commentary
      </h1>

      {data.map((entry, index) => (
        <div key={index} style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            {entry.date}
          </h2>

          <div style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {entry.markdown}
            </ReactMarkdown>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          ></div>
        </div>
      ))}

      <p style={{ fontSize: "0.8rem", marginTop: "2rem", color: "#aaa" }}>
        Updated: {currentTime}
      </p>
    </div>
  );
}
