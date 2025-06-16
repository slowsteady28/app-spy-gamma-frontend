import { useEffect, useState } from "react";
import MarketCommentaryCard from "./MarketCommentaryCard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface CommentaryEntry {
  date: string;
  markdown: string;
}

export default function MarketCommentary() {
  const [data, setData] = useState<CommentaryEntry[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null); // <-- Add this line

  // Fetch logic as a function
  const fetchCommentary = () => {
    setLoading(true);
    fetch(`${apiBaseUrl}/api/market-commentary`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch commentary:", err))
      .finally(() => setLoading(false));

    setCurrentTime(new Date());
  };

  useEffect(() => {
    fetchCommentary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-4 px-2 px-md-4">
      {/* Dashboard-style header */}
      <div className="row mb-4 align-items-end">
        <div className="col-12 col-md-8">
          <h2 className="mb-1 text-dark fw-bold">
            🧠 SPY Gamma Market Commentary
          </h2>
          <h3 className="text-body-tertiary fw-semibold mb-0 fs-5">
            Latest insights and analysis
          </h3>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0 d-flex flex-column align-items-md-end align-items-start">
          <span className="text-dark small mb-2 mb-md-0">
            Last updated: {currentTime ? dayjs(currentTime).fromNow() : "Never"}
          </span>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={fetchCommentary}
            disabled={loading}
            aria-label="Refresh commentary"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Commentary cards in a responsive grid */}
      <div className="row g-4">
        {loading ? (
          <>
            {[1, 2].map((n) => (
              <div
                className="col-12 col-sm-12 col-md-6 col-xl-6 d-flex"
                key={n}
              >
                <div className="card border-0 shadow-sm h-100 w-100 bg-body-emphasis d-flex flex-column">
                  <div className="card-header bg-transparent border-0 pb-0">
                    <span
                      className="badge bg-secondary placeholder col-6"
                      style={{ height: "1.5em" }}
                    />
                  </div>
                  <div className="card-body pt-2 d-flex flex-column">
                    <div className="placeholder-glow">
                      <span
                        className="placeholder col-12 mb-2"
                        style={{ height: "1em" }}
                      ></span>
                      <span
                        className="placeholder col-10 mb-2"
                        style={{ height: "1em" }}
                      ></span>
                      <span
                        className="placeholder col-8"
                        style={{ height: "1em" }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : data.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm p-4 text-center bg-body-emphasis">
              <p className="mb-0">No commentary available.</p>
            </div>
          </div>
        ) : (
          data.map((entry, idx) => (
            <div
              className="col-12 col-sm-12 col-md-6 col-xl-6 d-flex"
              key={entry.date}
            >
              <MarketCommentaryCard
                date={entry.date}
                markdown={entry.markdown}
                isFullscreen={fullscreenIdx === idx}
                onFullscreen={() => setFullscreenIdx(idx)}
                onExitFullscreen={() => setFullscreenIdx(null)}
              />
            </div>
          ))
        )}
      </div>

      {/* Back to Top Button */}
      {showTopBtn && (
        <button
          type="button"
          className="btn btn-primary position-fixed"
          style={{
            bottom: "2rem",
            right: "2rem",
            zIndex: 1050,
            borderRadius: "50%",
            width: "3rem",
            height: "3rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <span style={{ fontSize: "1.5rem" }}>↑</span>
        </button>
      )}
    </div>
  );
}
