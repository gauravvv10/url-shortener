import { useState } from "react";
import UrlForm from "../components/UrlForm";
import UrlStats from "../components/UrlStats";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("shorten");

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1><span className="gradient-text">LinkLite</span></h1>
        <p>Shorten & Track Links</p>
      </div>
      
      <div className="app-card glass-panel">
        <div className="tab-container">
          <button 
            className={`tab-btn ${activeTab === "shorten" ? "active" : ""}`}
            onClick={() => setActiveTab("shorten")}
          >
            ✨ Shorten
          </button>
          <button 
            className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            📊 Stats
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === "shorten" ? <UrlForm /> : <UrlStats />}
        </div>
      </div>
    </div>
  );
}