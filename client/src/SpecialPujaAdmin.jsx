import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./config";
import { strings } from "./i18n"; // Import translations

const adminStrings = {
  en: {
    active: "Active",
    switch: "Switch / Create New",
    add_to: "Add Devotee to",
    phone: "Phone",
    add_btn: "Add Devotee",
    registered: "Registered Devotees",
    scan: "Scan to Pay",
    amount: "Amount",
    raashi: "Raashi",
    family_title: "Family Members",
    add_fam: "+ Add Member",
    fam_name: "Name",
    fam_nak: "Nakshatra",
    cancel: "Cancel / Back",
  },
  kn: {
    active: "ಸಕ್ರಿಯ",
    switch: "ಬದಲಾಯಿಸಿ / ಹೊಸದನ್ನು ರಚಿಸಿ",
    add_to: "ವಿಶೇಷ ಪೂಜೆಗೆ ಸೇರಿಸಿ:",
    phone: "ದೂರವಾಣಿ",
    add_btn: "ಭಕ್ತರನ್ನು ಸೇರಿಸಿ",
    registered: "ನೋಂದಾಯಿತ ಭಕ್ತರು",
    scan: "ಪಾವತಿಸಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    amount: "ಮೊತ್ತ",
    raashi: "ರಾಶಿ",
    family_title: "ಕುಟುಂಬ ಸದಸ್ಯರು",
    add_fam: "+ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ",
    fam_name: "ಹೆಸರು",
    fam_nak: "ನಕ್ಷತ್ರ",
    cancel: "ರದ್ದುಮಾಡಿ / ಹಿಂದಕ್ಕೆ",
  },
};

const PUJA_PRICES = {
  Sankashta: 101,
  Pournami: 201, // Example
  "Vinayaka Chaturthi": 501,
};

const SpecialPujaAdmin = ({ lang = "kn" }) => {
  // Accept lang prop, default to English
  const [activePuja, setActivePuja] = useState(null);
  const [newType, setNewType] = useState("Sankashta");
  const [newDate, setNewDate] = useState("");

  // Devotee Form State
  const [devName, setDevName] = useState("");
  const [devGothra, setDevGothra] = useState("");
  const [devNakshatra, setDevNakshatra] = useState("");
  const [devRaashi, setDevRaashi] = useState("");
  const [devPhone, setDevPhone] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);

  const S = strings[lang]; // Shortcut for translations
  const A = adminStrings[lang];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchUpcoming();
  }, []);

  const fetchUpcoming = () => {
    axios
      .get(`${API_URL}/special-puja/upcoming`)
      .then((res) => setActivePuja(res.data))
      .catch((err) => console.error(err));
  };

  const handleCreate = async () => {
    if (!newDate) return alert("Please pick a date");
    const dateObj = new Date(newDate);
    const dateStr = dateObj.toLocaleDateString("en-GB");

    await axios.post(`${API_URL}/special-puja/create`, {
      pujaType: newType,
      dateStr: dateStr,
    });
    fetchUpcoming();
    alert("New Special Puja Created!");
  };

  // --- Family Logic ---
  const addFamilyRow = () => {
    setFamilyMembers([
      ...familyMembers,
      { name: "", raashi: "", nakshatra: "" },
    ]);
  };

  const updateFamilyRow = (index, field, value) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const removeFamilyRow = (index) => {
    const updated = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updated);
  };
  // --------------------

  const handleAddDevotee = async (e) => {
    e.preventDefault();
    if (!activePuja) return alert("No active puja to add to.");
    const basePrice = PUJA_PRICES[activePuja.pujaType] || 101;
    await axios.post(`${API_URL}/special-puja/add-devotee`, {
      name: devName,
      gothra: devGothra,
      nakshatra: devNakshatra,
      raashi: devRaashi,
      phoneNumber: devPhone,
      amount: basePrice,
      familyMembers: familyMembers,
    });

    setDevName("");
    setDevGothra("");
    setDevNakshatra("");
    setDevPhone("");
    fetchUpcoming();
  };

  // Helper to get current price safely
  const currentPrice = activePuja ? PUJA_PRICES[activePuja.pujaType] || 101 : 0;

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        border: "2px solid #b8860b",
        borderRadius: "10px",
        backgroundColor: "#fff8e1",
      }}
    >
      <h2 style={{ color: "#8b0000", textAlign: "center" }}>
        🪔 {S.D_UPCOMING || "Special Puja Manager"}
      </h2>

      {!activePuja ? (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h3>Create new event:</h3>
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            style={{ padding: "8px", marginRight: "10px" }}
          >
            <option value="Sankashta">Sankashta</option>
            <option value="Pournami">Pournami</option>
          </select>
          <input
            type="date"
            onChange={(e) => setNewDate(e.target.value)}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <button
            onClick={handleCreate}
            style={{
              padding: "8px 16px",
              background: "#b8860b",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create
          </button>
          <button
            onClick={fetchUpcoming} // Simply re-fetches the active event
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
              background: "#ccc",
              color: "#333",
              border: "none",
              cursor: "pointer",
              borderRadius: "2px",
            }}
          >
            {A.cancel || "Back"}
          </button>
        </div>
      ) : (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            background: "rgba(184, 134, 11, 0.1)",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>
            {A.active}:{" "}
            <span style={{ color: "#d32f2f" }}>{activePuja.pujaType}</span>{" "}
            {lang === "en" ? "on" : "ದಿನಾಂಕ"} {activePuja.dateStr}
          </h3>
          <button
            onClick={() => setActivePuja(null)}
            style={{ fontSize: "0.8rem", cursor: "pointer" }}
          >
            ({A.switch})
          </button>
        </div>
      )}

      {activePuja && (
        <>
          <h3 style={{ textAlign: "center", color: "#4b2e1e" }}>
            {A.add_to} {activePuja.pujaType}
          </h3>

          <form
            onSubmit={handleAddDevotee}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              maxWidth: "450px",
              margin: "0 auto",
            }}
          >
            {/* MAIN DEVOTEE INPUTS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                width: "100%",
              }}
            >
              <input
                placeholder={S.P_NAME || "Name"}
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                required
                style={{ padding: "8px" }}
              />
              <input
                placeholder={S.P_GOTHRA || "Gothra"}
                value={devGothra}
                onChange={(e) => setDevGothra(e.target.value)}
                required
                style={{ padding: "8px" }}
              />
              <input
                placeholder={S.P_NAKSHATRA || "Nakshatra"}
                value={devNakshatra}
                onChange={(e) => setDevNakshatra(e.target.value)}
                style={{ padding: "8px" }}
              />
              <input
                placeholder={A.raashi}
                value={devRaashi}
                onChange={(e) => setDevRaashi(e.target.value)}
                style={{ padding: "8px" }}
              />

              {/* Phone spans full width */}
              <input
                placeholder={A.phone}
                value={devPhone}
                onChange={(e) => setDevPhone(e.target.value)}
                style={{ padding: "8px", gridColumn: "span 2" }}
              />
            </div>

            {/* FAMILY MEMBERS SECTION */}
            <div
              style={{
                width: "100%",
                marginTop: "10px",
                borderTop: "1px dashed #b8860b",
                paddingTop: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <strong style={{ color: "#b8860b" }}>{A.family_title}</strong>
                <button
                  type="button"
                  onClick={addFamilyRow}
                  style={{
                    padding: "5px 10px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  {A.add_fam}
                </button>
              </div>

              {familyMembers.map((member, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <input
                    placeholder={A.fam_name}
                    value={member.name}
                    onChange={(e) =>
                      updateFamilyRow(index, "name", e.target.value)
                    }
                    style={{ padding: "5px", width: "100%" }}
                  />
                  <input
                    placeholder={A.raashi}
                    value={member.raashi}
                    onChange={(e) =>
                      updateFamilyRow(index, "raashi", e.target.value)
                    }
                    style={{ padding: "5px", width: "100%" }}
                  />
                  <input
                    placeholder={A.fam_nak}
                    value={member.nakshatra}
                    onChange={(e) =>
                      updateFamilyRow(index, "nakshatra", e.target.value)
                    }
                    style={{ padding: "5px", width: "100%" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFamilyRow(index)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      padding: "0 8px",
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              style={{
                marginTop: "15px",
                padding: "10px 25px",
                background: "#d35400",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.95rem",
              }}
            >
              {A.add_btn}
            </button>
          </form>

          {/* LIST */}
          <div style={{ marginTop: "20px" }}>
            <h4 style={{ textAlign: "center" }}>
              {A.registered} ({activePuja.devotees.length})
            </h4>
            <ul
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                background: "#fff",
                padding: "10px",
                border: "1px solid #ccc",
                listStyle: "none",
              }}
            >
              {activePuja.devotees.map((d, i) => (
                <li
                  key={i}
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: "5px 0",
                    textAlign: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <strong>{d.name}</strong> ({d.gothra})
                  {d.familyMembers && d.familyMembers.length > 0 && (
                    <span> + {d.familyMembers.length} family</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* QR CODE */}
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              borderTop: "2px dashed #b8860b",
              paddingTop: "20px",
            }}
          >
            <h4 style={{ color: "#b8860b", margin: "0 0 10px 0" }}>{A.scan}</h4>
            <h3 style={{ color: "#d35400", margin: "5px 0" }}>
              {A.amount}: ₹{currentPrice}
            </h3>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=temple@upi&pn=Temple&am=${currentPrice}`}
              alt="Temple QR"
              style={{
                border: "5px solid #fff",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SpecialPujaAdmin;
