import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  date: string;
  markdown: string;
}

export default function MarketCommentaryCard({ date, markdown }: Props) {
  return (
    <div className="card border-0 shadow-sm h-100 w-100 bg-body-emphasis d-flex flex-column">
      <div className="card-header bg-transparent border-0 pb-0">
        <span className="badge bg-primary-subtle text-primary fw-semibold fs-10">
          {date}
        </span>
      </div>
      <div className="card-body pt-2 d-flex flex-column">
        <div className="text-body">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
