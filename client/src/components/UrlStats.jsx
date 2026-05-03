import { useState } from "react";
import axios from "axios";

export default function UrlStats() {
  const [shortId, setShortId] = useState("");
  const [data, setData] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/stats/${shortId}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="form-section">
      <h2>📊 Track Performance</h2>
      
      <div className="input-group">
        <input
          className="styled-input"
          value={shortId}
          onChange={(e) => setShortId(e.target.value)}
          placeholder="Enter the short ID..."
        />
        <button className="glow-button" onClick={fetchStats}>
          View Stats
        </button>
      </div>

      {data && (
        <div className="stats-data">
          <div className="stat-item">
            <span className="stat-label">Total Clicks</span>
            <span className="stat-value highlight">{data.clicks}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Original URL</span>
            <span className="stat-value" style={{ fontSize: "0.95rem" }}>
              {data.originalUrl}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}