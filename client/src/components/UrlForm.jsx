import { useState } from "react";
import axios from "axios";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortId, setShortId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/shorten`,
        {
          originalUrl: url,
        }
      );

      setShortUrl(res.data.shortUrl);
      setShortId(res.data.shortId);
    } catch (err) {
      console.error("Error shortening URL:", err);
    }
  };

  return (
    <div className="form-section">
      <h2>✨ Shorten a URL</h2>
      <form onSubmit={handleSubmit} className="input-group">
        <input
          className="styled-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your long URL here..."
          type="url"
          required
        />
        <button className="glow-button" type="submit">
          Shorten Link
        </button>
      </form>

      {shortUrl && (
        <div className="result-card">
          <p>Your shortened URL is ready:</p>
          <a className="result-link" href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
          <p style={{ marginTop: "10px" }}>ID: <span className="result-value">{shortId}</span></p>
        </div>
      )}
    </div>
  );
}