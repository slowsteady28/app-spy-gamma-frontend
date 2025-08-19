import React, { useEffect } from "react";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface Props {
  limit?: number;
}

const CW1LowNetCallGamma: React.FC<Props> = ({ limit = 250 }) => {
  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/retest/hourly/results?limit=${limit}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Error fetching hourly results:", err);
      });
  }, [limit]);

  return null; // no UI yet
};

export default CW1LowNetCallGamma;
