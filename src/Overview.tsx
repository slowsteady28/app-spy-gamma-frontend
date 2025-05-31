import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

interface OverviewDataPoint {
  "Date (EOD)": string;
  CW1: number;
  PW1: number;
  KG1: number;
  "Net Change in Call OI ": number;
  "Net Change in Put OI": number;
  "Gamma Tilt": number;
  "Total Call Gamma": number;
  "Total Put Gamma": number;
  "Total Net Gamma": number;
}

const OverView = () => {
  const [data, setData] = useState<OverviewDataPoint[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/api/overview`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch data", err));
  }, []);

  // ⬇️ Calculate Y-axis range based on CW1, PW1, KG1 values
  const wallYDomain = useMemo(() => {
    if (data.length === 0) return [0, 1000];
    const allValues = data.flatMap((d) => [
      Number(d.CW1),
      Number(d.PW1),
      Number(d.KG1),
    ]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    return [Math.floor(min * 0.98), Math.ceil(max * 1.02)];
  }, [data]);

  return (
    <div className="p-4 grid grid-cols-1 gap-6">
      {/* Call Wall, Put Wall, Key Gamma Strikes */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-2">
          Call Wall, Put Wall, Key Gamma Strikes
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="Date (EOD)" />
            <YAxis domain={wallYDomain} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="CW1"
              stroke="blue"
              name="Call Wall"
            />
            <Line type="monotone" dataKey="PW1" stroke="red" name="Put Wall" />
            <Line
              type="monotone"
              dataKey="KG1"
              stroke="green"
              name="Key Gamma Strike"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Net Change in Call and Put OI */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-2">
          Net Change in Call and Put OI
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="Date (EOD)" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Net Change in Call OI "
              stroke="purple"
              name="Call OI"
            />
            <Line
              type="monotone"
              dataKey="Net Change in Put OI"
              stroke="orange"
              name="Put OI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gamma Tilt */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-2">Gamma Tilt</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="Date (EOD)" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Gamma Tilt"
              stroke="brown"
              name="Gamma Tilt"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Total Call, Put, and Net Gamma */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-2">Total Gamma Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="Date (EOD)" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Total Call Gamma"
              stroke="green"
              name="Total Call Gamma"
            />
            <Line
              type="monotone"
              dataKey="Total Put Gamma"
              stroke="red"
              name="Total Put Gamma"
            />
            <Line
              type="monotone"
              dataKey="Total Net Gamma"
              stroke="blue"
              name="Net Gamma"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverView;
