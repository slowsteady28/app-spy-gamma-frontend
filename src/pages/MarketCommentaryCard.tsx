import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  date: string;
  markdown: string;
  isFullscreen?: boolean;
  onFullscreen?: () => void;
  onExitFullscreen?: () => void;
}

export default function MarketCommentaryCard({
  date,
  markdown,
  isFullscreen = false,
  onFullscreen,
  onExitFullscreen,
}: Props) {
  // Prevent click propagation when clicking inside the card in fullscreen mode
  const handleCardClick = (e: React.MouseEvent) => {
    if (isFullscreen) e.stopPropagation();
    else if (onFullscreen) onFullscreen();
  };

  return (
    <>
      {isFullscreen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1050,
          }}
          onClick={onExitFullscreen}
        />
      )}
      <div
        className={`card border-0 shadow-sm h-100 w-100 bg-body-emphasis d-flex flex-column${
          isFullscreen ? " fullscreen-card" : ""
        }`}
        style={
          isFullscreen
            ? {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1060,
                width: "96vw",
                maxWidth: 1100,
                height: "92vh",
                maxHeight: 900,
                overflow: "auto",
                boxShadow: "0 0 48px 12px rgba(0,0,0,0.30)",
                background: "#fff",
                padding: "2.5rem 2rem",
                borderRadius: "1.5rem",
              }
            : { cursor: "pointer" }
        }
        onClick={handleCardClick}
      >
        <div className="card-header bg-transparent border-0 pb-0 d-flex align-items-center gap-2">
          <span
            className="text-primary"
            aria-hidden="true"
            style={{ fontSize: "1.5rem" }}
          >
            🧠
          </span>
          <span
            className="badge bg-primary text-white fw-semibold fs-10"
            aria-label={`Commentary date: ${date}`}
            style={{
              fontSize: isFullscreen ? "1.25rem" : undefined,
              padding: isFullscreen ? "0.75em 1.25em" : undefined,
            }}
          >
            {date}
          </span>
          {isFullscreen && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary ms-auto"
              onClick={(e) => {
                e.stopPropagation();
                if (onExitFullscreen) onExitFullscreen();
              }}
              style={{
                zIndex: 1100,
                fontSize: "1.5rem",
                padding: "0.25em 0.75em",
              }}
              aria-label="Close fullscreen"
            >
              &times;
            </button>
          )}
        </div>
        <div className="card-body pt-2 d-flex flex-column">
          <div
            className="text-body"
            style={{
              fontSize: isFullscreen ? "1.45rem" : "1rem",
              lineHeight: isFullscreen ? 1.7 : 1.5,
              fontWeight: isFullscreen ? 500 : 400,
            }}
          >
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  );
}
