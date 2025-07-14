import { useMemo } from "react";

const tradingQuotes = [
  "In trading, it's not about how much you make, but how much you don’t lose. – Bernard Baruch",
  "The goal of a successful trader is to make the best trades. Money is secondary. – Alexander Elder",
  "Amateurs think about how much money they can make. Professionals think about how much money they could lose. – Jack Schwager",
  "Every trader has strengths and weaknesses. Some are good at patience, others at discipline. Learn yours. – Mark Douglas",
  "To be a good trader, you must be comfortable being uncomfortable. – Unknown",
];

function getRandomQuote() {
  return tradingQuotes[Math.floor(Math.random() * tradingQuotes.length)];
}

const ChartSkeleton = () => {
  const quote = useMemo(() => getRandomQuote(), []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5 px-3 text-center">
      <div className="spinner-border text-primary mb-3" role="status" />
      <blockquote className="blockquote">
        <p
          style={{ fontStyle: "italic", fontSize: "0.95rem", color: "#495057" }}
        >
          {quote}
        </p>
      </blockquote>
    </div>
  );
};

export default ChartSkeleton;
