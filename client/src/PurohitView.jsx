import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./config";
import "./PurohitView.css";

const PurohitView = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setStatus] = useState("");
  const [devotees, setDevotees] = useState([]);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB"); // DD/MM/YYYY

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDevotees();
  }, []);

  const fetchDevotees = async () => {
    try {
      const res = await axios.get(`${API_URL}/devotees/today`);
      setDevotees(res.data);
    } catch (err) {
      console.error("Error fetching devotees", err);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a photo first!");
    setStatus("⏳ Uploading...");
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_URL}/photos/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setStatus("✅ Upload Successful!");
        const photoUrl = res.data.data.photoURL;
        const msg = `🙏 Sri Satyaganapathy Temple\n\nToday's puja photo uploaded for ${dateStr}.\n\nView here:\n${photoUrl}`;
        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(msg)}`;
        window.open(whatsappLink, "_blank");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload Failed");
    }
  };

  return (
    <div className="purohit-container">
      <h1>🙏 Sri Satyaganapathy Temple 🙏</h1>
      <h3>Date: {dateStr}</h3>

      {/* Upload Section */}
      <div className="upload-section">
        <h2>📸 Upload Puja Photo</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="preview" />}
        <br />
        <button onClick={handleUpload}>Upload & Share on WhatsApp</button>
        <p>
          <strong>{uploadStatus}</strong>
        </p>
      </div>

      {/* Devotee List Section */}
      <h1>Today's Special Puja Devotees</h1>
      {devotees.length === 0 ? (
        <div className="devotee-box">No devotees scheduled for today.</div>
      ) : (
        devotees.map((dev, index) => (
          <div key={index} className="devotee-box">
            {/* Header changed to Family Name */}
            <h3 style={{ color: "#8b0000" }}>{dev.mainDevotee} & Family</h3>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gothra</th> {/* Gothra moved here */}
                  <th>Nakshatra</th>
                  <th>Raashi</th>
                </tr>
              </thead>
              <tbody>
                {/* Main Devotee Row */}
                <tr>
                  <td>
                    <strong>{dev.mainDevotee}</strong>
                  </td>
                  <td>{dev.gothra}</td>
                  <td>{dev.nakshatra}</td>
                  <td>{dev.raashi}</td>
                </tr>
                {/* Family Members Rows */}
                {dev.familyMembers.map((fam, i) => (
                  <tr key={i}>
                    <td>{fam.name}</td>
                    <td>{dev.gothra}</td> {/* Assuming family shares Gothra */}
                    <td>{fam.nakshatra}</td>
                    <td>{fam.raashi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default PurohitView;
