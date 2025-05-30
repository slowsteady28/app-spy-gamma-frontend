// File: PutWallMetrics.tsx
import { useEffect, useState } from "react";
import axios from "axios";

function PutWallMetrics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/data/pw1-summary")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load metrics:", err));
  }, []);

  if (!data) return <div>Loading metrics...</div>;

  return (
    <div className="row my-4 text-center">
      <div className="col-md-3">
        <div className="border p-3 rounded shadow-sm bg-light">
          <h6>SPY Put Wall</h6>
          <h5>{data.put_wall}</h5>
          <small>Δ {data.put_wall_delta.toFixed(2)}</small>
        </div>
      </div>
      <div className="col-md-3">
        <div className="border p-3 rounded shadow-sm bg-light">
          <h6>Net Gamma</h6>
          <h5>{data.net_gamma.toLocaleString()}</h5>
          <small>Δ {data.net_gamma_delta.toLocaleString()}</small>
        </div>
      </div>
      <div className="col-md-3">
        <div className="border p-3 rounded shadow-sm bg-light">
          <h6>Call OI Change</h6>
          <h5>{data.call_oi_change.toLocaleString()}</h5>
          <small>Prior: {data.call_oi_prev.toLocaleString()}</small>
        </div>
      </div>
      <div className="col-md-3">
        <div className="border p-3 rounded shadow-sm bg-light">
          <h6>Put OI Change</h6>
          <h5>{data.put_oi_change.toLocaleString()}</h5>
          <small>Prior: {data.put_oi_prev.toLocaleString()}</small>
        </div>
      </div>
    </div>
  );
}

export default PutWallMetrics;
