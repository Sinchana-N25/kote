import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./config";
import "./DevoteeView.css";

const DevoteeView = () => {
  const [photoUrl, setPhotoUrl] = useState("");
  const [mainDevoteeLine, setMainDevoteeLine] = useState(""); // Stores "Amit Sharma and Family"
  const [dateStr, setDateStr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateStr(today.toLocaleDateString("en-GB"));

    // 1. Fetch Photo
    axios
      .get(`${API_URL}/photos/latest`)
      .then((res) => {
        if (res.data && res.data.photoURL) setPhotoUrl(res.data.photoURL);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Photo fetch error", err);
        setLoading(false);
      });

    // 2. Fetch Devotees List for the name display
    axios
      .get(`${API_URL}/devotees/today`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // If there are multiple families, we join them, otherwise just show the first one
          const names = res.data
            .map((d) => `${d.mainDevotee} and family`)
            .join(" & ");
          setMainDevoteeLine(names);
        }
      })
      .catch((err) => console.log("Devotee fetch error", err));
  }, []);

  return (
    <div className="devotee-wrapper">
      {/* Top Rangoli */}
      <svg
        className="rangoli-top"
        viewBox="0 0 1200 90"
        preserveAspectRatio="none"
      >
        <g
          fill="none"
          stroke="#b8860b"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M30 60 c20 -30 60 -30 80 0 c20 30 60 30 80 0 c20 -30 60 -30 80 0"
            opacity=".95"
          />
          <path
            d="M30 40 c20 -20 60 -20 80 0 c20 20 60 20 80 0 c20 -20 60 -20 80 0"
            opacity=".5"
          />
        </g>
      </svg>

      {/* Lamps */}
      <div className="lamp left">
        <svg viewBox="0 0 120 300" width="100%" height="100%">
          <g fill="none" stroke="#b88729" strokeWidth="3">
            <path d="M60 2 v38" strokeLinecap="round" opacity="0.95" />
          </g>
          <g transform="translate(0,60)">
            <ellipse
              cx="60"
              cy="80"
              rx="34"
              ry="18"
              fill="#d4a017"
              stroke="#a87306"
              strokeWidth="2"
            />
            <rect x="56" y="22" width="8" height="45" rx="4" fill="#b8860b" />
            <g className="flame" transform="translate(60,52)">
              <path
                d="M0 -2 c6 -8 10 -14 2 -28 c-6 10 -10 16 -2 28 z"
                fill="#ffb74d"
              />
            </g>
          </g>
        </svg>
      </div>
      <div className="lamp right">
        <svg
          viewBox="0 0 120 300"
          width="100%"
          height="100%"
          style={{ transform: "scaleX(-1)" }}
        >
          <g fill="none" stroke="#b88729" strokeWidth="3">
            <path d="M60 2 v38" strokeLinecap="round" opacity="0.95" />
          </g>
          <g transform="translate(0,60)">
            <ellipse
              cx="60"
              cy="80"
              rx="34"
              ry="18"
              fill="#d4a017"
              stroke="#a87306"
              strokeWidth="2"
            />
            <rect x="56" y="22" width="8" height="45" rx="4" fill="#b8860b" />
            <g className="flame" transform="translate(60,52)">
              <path
                d="M0 -2 c6 -8 10 -14 2 -28 c-6 10 -10 16 -2 28 z"
                fill="#ffb74d"
              />
            </g>
          </g>
        </svg>
      </div>

      <div className="container">
        <header>
          <h1>Today's Special Puja</h1>
          <div id="date">Date: {dateStr}</div>
        </header>

        <main>
          <div id="photoWrap">
            {photoUrl ? (
              <img id="photo" src={photoUrl} alt="Today's Puja" />
            ) : (
              <div
                style={{
                  padding: "50px",
                  textAlign: "center",
                  color: "#b8860b",
                }}
              >
                {loading ? "Loading Photo..." : "Photo not uploaded yet"}
              </div>
            )}
          </div>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
            {/* The Static Divine Message */}
            <p
              style={{
                fontSize: "1.45rem",
                color: "#4b2e1e", // Darker brown/Deep color
                fontWeight: "600",
                marginBottom: "10px",
                textShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              May the divine grace of Sri Satyaganapathy bless every devotee
            </p>

            {/* The Dynamic Name (Amit Sharma and family) */}
            {mainDevoteeLine && (
              <p
                style={{
                  fontSize: "1.6rem",
                  color: "#8b0000", // Accent Red
                  fontWeight: "700",
                  textShadow: "0 1px 4px rgba(0,0,0,0.12)",
                }}
              >
                {mainDevoteeLine}
              </p>
            )}
          </div>
        </main>
        <footer>Daily Puja Blessings</footer>
      </div>

      <svg
        className="rangoli-bottom"
        viewBox="0 0 1200 90"
        preserveAspectRatio="none"
      >
        <g
          fill="none"
          stroke="#b8860b"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M30 20 c20 30 60 30 80 0 c20 -30 60 -30 80 0 c20 30 60 30 80 0"
            opacity=".95"
          />
        </g>
      </svg>
    </div>
  );
};

export default DevoteeView;
