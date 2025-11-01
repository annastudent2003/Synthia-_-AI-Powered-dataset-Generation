import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Results.css";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [prompt, setPrompt] = useState(queryParams.get("prompt") || "");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datasetLink, setDatasetLink] = useState("");

  const API_URL = process.env.API_URL || "http://localhost:5000";
  console.log("Backend URL →", API_URL);

  // 🔹 Fetch preview images (lightweight)
  const fetchPreview = async (userPrompt = prompt) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error("Error fetching preview:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Trigger heavy pipeline only on download
  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.datasetZip) {
        window.open(`${API_URL}${data.datasetZip}`, "_blank");
      }
    } catch (err) {
      console.error("Error during download:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 On first load
  useEffect(() => {
    if (prompt) fetchPreview(prompt);
  }, [prompt]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (prompt.trim() !== "") {
      navigate(`/results?prompt=${encodeURIComponent(prompt)}`);
      fetchPreview(prompt);
    }
  };

  const handleRegenerate = () => {
    fetchPreview(prompt);
  };

  return (
    <div className="results-page">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Search or type a prompt..."
        />
        <button type="submit">Search</button>
      </form>

      <div className="button-row">
        <button onClick={handleRegenerate} className="regen-btn">
          🔁 Regenerate
        </button>
        <button onClick={handleDownload} className="download-btn">
          ⬇️ Download All
        </button>
      </div>

      {loading ? (
        <div className="loading-text">Processing...</div>
      ) : (
        <div className="results-grid">
          {images.map((img, i) => (
            <div key={i} className="result-card">
              <img src={img.url} alt={`Generated ${i}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
