import { useState } from "react";
import axios from "axios";
import "./components.css";

export default function UrlStats() {
  const [shortId, setShortId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    if (!shortId.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/stats/${shortId.trim()}`
      );
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Short ID not found. Check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchStats();
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="form-section">
      <div className="form-section-title">
        <span className="form-icon">📊</span>
        Track Performance
      </div>

      <div className="input-row">
        <input
          className="styled-input"
          value={shortId}
          onChange={(e) => setShortId(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter short ID (e.g. abc1234)…"
        />
        <button
          className="btn-primary"
          onClick={fetchStats}
          disabled={loading}
          type="button"
        >
          {loading
            ? <><span className="btn-spinner" /> Loading…</>
            : "View Stats →"}
        </button>
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      {data && (
        <div className="stats-data">
          <div className="stat-item">
            <div className="stat-label">Total Clicks</div>
            <div className="stat-value big">{data.clicks}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Short ID</div>
            <div className="stat-value mono">{data.shortId}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Original URL</div>
            <div className="stat-value" style={{ fontSize: "0.875rem" }}>
              <a href={data.originalUrl} target="_blank" rel="noreferrer">
                {data.originalUrl}
              </a>
            </div>
          </div>

          {data.createdAt && (
            <div className="stat-item">
              <div className="stat-label">Created</div>
              <div className="stat-value mono" style={{ fontSize: "0.875rem" }}>
                {formatDate(data.createdAt)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}