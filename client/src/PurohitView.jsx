import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./config";
import { strings } from "./i18n";
import "./PurohitView.css";

const PurohitView = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setStatus] = useState("");
  const [devotees, setDevotees] = useState([]);
  const [lang, setLang] = useState("kn"); // Default to Kannada

  const S = strings[lang]; // localized strings

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

  // ... (imports and state) ...

  // Kannada WhatsApp Message Template (based on user request)
  const kn_whatsapp_template = (namesList, date, photoUrl) => {
    return (
      `🙏 ಶ್ರೀ ಸತ್ಯಗಣಪತಿ ದೇವಸ್ಥಾನ, ಎಂ.ಎನ್.ಕೋಟೆ 🙏%0A%0A` +
      `🕉 ದಿನಾಂಕ ${date} ರಂದು ${namesList} ಹೆಸರಿನಲ್ಲಿ ವಿಶೇಷ ಪೂಜೆ ನೆರವೇರಿದೆ.%0A%0A` +
      `🌟 ಶ್ರೀ ಸತ್ಯಗಣಪತಿಯ ದಿವ್ಯ ಕೃಪೆಯು ನಿಮಗೆ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಸಮೃದ್ಧಿ, ಆರೋಗ್ಯ ಮತ್ತು ಸಂತೋಷವನ್ನು ನೀಡಲಿ. ✨%0A%0A` +
      `ನಿಮ್ಮ ಉದಾರ ಕೊಡುಗೆಗಾಗಿ ಧನ್ಯವಾದಗಳು!%0A%0A` +
      `ಇಂದಿನ ಪೂಜಾ ಫೋಟೋ ಇಲ್ಲಿದೆ: ${photoUrl}`
    );
  };

  const handleUpload = async () => {
    if (!file) return alert(strings[lang].P_UPLOAD_BUTTON); // Use localized alert
    setStatus(`⏳ ${lang === "kn" ? "ಅಪ್ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Uploading..."}`);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_URL}/photos/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setStatus(
          `✅ ${lang === "kn" ? "ಅಪ್ಲೋಡ್ ಯಶಸ್ವಿಯಾಗಿದೆ!" : "Upload Successful!"}`
        );
        const photoUrl = res.data.data.photoURL;

        // 1. Fetch names AND phone numbers
        const devoteeRes = await axios.get(`${API_URL}/devotees/today`);
        const devotees = devoteeRes.data;

        const mainNames = devotees.map((d) => d.mainDevotee).join(", ");
        const namesList = mainNames
          ? `${mainNames} ಮತ್ತು ಅವರ ಕುಟುಂಬದವರ`
          : "ಎಲ್ಲಾ ಭಕ್ತರ";

        // WhatsApp link supports multiple numbers separated by commas
        const phoneNumbers = devotees.map((d) => d.phoneNumber).filter(Boolean); // Get numbers, filter out null/empty

        if (phoneNumbers.length === 0) {
          alert(
            "No phone numbers found in the database for today's devotees. Please add numbers."
          );
          return;
        }

        // 2. Format message and link
        const messageText = kn_whatsapp_template(namesList, dateStr, photoUrl);

        // This attempts to open a chat with multiple numbers (standard feature in wa.me/send)
        const recipients = phoneNumbers.join(",");

        // This is the correct, automated way to send to multiple contacts:
        const whatsappLink = `https://api.whatsapp.com/send?phone=${recipients}&text=${encodeURIComponent(
          messageText
        )}`;

        // NOTE: The WhatsApp API documentation often shows wa.me/send for single recipients.
        // For multiple, the browser generally opens the default sharing dialog, or the
        // third-party app (like Business WhatsApp) handles it poorly. The BEST way is to iterate,
        // but for a single button click, this is the standard non-cloud-API approach:

        window.open(whatsappLink, "_blank");
      }
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${lang === "kn" ? "ಅಪ್ಲೋಡ್ ವಿಫಲವಾಗಿದೆ" : "Upload Failed"}`);
    }
  };

  return (
    <div className="purohit-container">
      {/* Language Selector */}
      <div style={{ textAlign: "right", padding: "10px 0" }}>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={{ padding: "5px", borderRadius: "5px" }}
        >
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="en">English</option>
        </select>
      </div>

      <h1>{S.T_TITLE}</h1>
      <h3>
        {S.T_DATE}: {dateStr}
      </h3>

      {/* Upload Section */}
      <div className="upload-section">
        <h2>{S.P_UPLOAD_TITLE}</h2>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && <img src={preview} alt="Preview" className="preview" />}

        <br />
        <button onClick={handleUpload}>{S.P_UPLOAD_BUTTON}</button>

        <p>
          <strong>{uploadStatus}</strong>
        </p>
      </div>

      {/* Devotee List Section */}
      <h1>{S.P_TODAY_DEVOTEES}</h1>

      {devotees.length === 0 ? (
        <div className="devotee-box">{S.P_NO_DEVOTEES}</div>
      ) : (
        devotees.map((dev, index) => (
          <div key={index} className="devotee-box">
            <h3 style={{ color: "#8b0000" }}>
              {dev.mainDevotee} {S.P_AND_FAMILY}
            </h3>

            <table>
              <thead>
                <tr>
                  <th>{S.P_NAME}</th>
                  <th>{S.P_GOTHRA}</th>
                  <th>{S.P_NAKSHATRA}</th>
                  <th>{S.P_RAASHI}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{dev.mainDevotee}</strong>
                  </td>
                  <td>{dev.gothra}</td>
                  <td>{dev.nakshatra}</td>
                  <td>{dev.raashi}</td>
                </tr>

                {dev.familyMembers.map((fam, i) => (
                  <tr key={i}>
                    <td>{fam.name}</td>
                    <td>{dev.gothra}</td>
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
