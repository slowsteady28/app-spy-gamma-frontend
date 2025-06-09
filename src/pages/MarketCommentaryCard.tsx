import React from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "react-bootstrap";

interface MarketCommentaryCardProps {
  date: string;
  markdown: string;
}

const MarketCommentaryCard: React.FC<MarketCommentaryCardProps> = ({
  date,
  markdown,
}) => {
  return (
    <Card className="mb-4 shadow rounded-3">
      <Card.Header className="bg-dark text-white fw-bold fs-5">
        📅 {formatDate(date)}
      </Card.Header>
      <Card.Body className="fs-6" style={{ whiteSpace: "pre-wrap" }}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </Card.Body>
    </Card>
  );
};

// Optional: Converts '06-09-2025' to 'June 9, 2025'
function formatDate(dateStr: string): string {
  try {
    const parsed = new Date(dateStr);
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default MarketCommentaryCard;
