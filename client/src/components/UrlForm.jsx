import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./components.css";

let QRCode = null;

async function loadQR() {
  if (QRCode) return QRCode;
  try {
    const mod = await import("qrcode");
    QRCode = mod.default ?? mod;
    return QRCode;
  } catch {
    return null;
  }
}

function QrDisplay({ url, onToast }) {
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setImgSrc("");

    (async () => {
      const qr = await loadQR();

      if (qr && canvasRef.current) {
        try {
          await qr.toCanvas(canvasRef.current, url, {
            width: 160,
            margin: 1,
            color: { dark: "#0F172A", light: "#FFFFFF" },
          });
          if (!cancelled) setReady(true);
          return;
        } catch {
          /* fall through to API */
        }
      }

      // Fallback: free QR API
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}&color=0F172A&bgcolor=FFFFFF&margin=8`;
      if (!cancelled) {
        setImgSrc(apiUrl);
      }
    })();

    return () => { cancelled = true; };
  }, [url]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas && ready && !imgSrc) {
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      onToast?.("✓ QR code downloaded!");
      return;
    }
    if (imgSrc) {
      window.open(imgSrc + "&format=png", "_blank");
    }
  };

  const showCanvas = !imgSrc;
  const showImg = !!imgSrc;

  return (
    <div className="qr-block">
      <span className="qr-label">QR Code</span>
      <div className="qr-canvas-wrapper">
        <canvas
          ref={canvasRef}
          style={{ display: showCanvas && ready ? "block" : "none", width: 148, height: 148 }}
        />
        {showImg && (
          <img
            src={imgSrc}
            alt="QR code"
            width={148}
            height={148}
            style={{ display: ready ? "block" : "none" }}
            onLoad={() => setReady(true)}
          />
        )}
        {!ready && (
          <div style={{ width: 148, height: 148, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="btn-spinner-blue" />
          </div>
        )}
      </div>
      <button className="qr-download-btn" onClick={handleDownload} type="button">
        ↓ Download PNG
      </button>
    </div>
  );
}

export default function UrlForm({ onToast }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/shorten`,
        { originalUrl: url }
      );
      setResult({ shortUrl: res.data.shortUrl, shortId: res.data.shortId });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      onToast?.("✓ Copied to clipboard!");
    } catch {
      onToast?.("Copy failed — try manually");
    }
  };

  return (
    <div className="form-section">
      <div className="form-section-title">
        <span className="form-icon">🔗</span>
        Shorten a URL
      </div>

      <form onSubmit={handleSubmit} className="input-row">
        <input
          className="styled-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your long URL here…"
          type="url"
          required
          autoComplete="url"
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading
            ? <><span className="btn-spinner" /> Shortening…</>
            : "Shorten & Generate QR →"}
        </button>
      </form>

      {error && <div className="error-msg">⚠ {error}</div>}

      {result && (
        <div className="result-area">
          <div className="result-divider" />

          <div className="result-url-block">
            <div className="result-url-label">Your short link</div>
            <div className="result-url-row">
              <a className="result-link" href={result.shortUrl} target="_blank" rel="noreferrer">
                {result.shortUrl}
              </a>
              <button className="copy-btn" onClick={handleCopy} type="button">Copy</button>
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="result-id-badge">
                <span className="lbl">ID</span>
                <span className="val">{result.shortId}</span>
              </span>
            </div>
          </div>

          <QrDisplay url={result.shortUrl} onToast={onToast} />
        </div>
      )}
    </div>
  );
}