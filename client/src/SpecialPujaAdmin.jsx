import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./config";
import { strings } from "./i18n";

// --- 1. PUJA OPTIONS LIST ---
const PUJA_OPTIONS = [
  {
    id: "Archane",
    price: 20,
    en: "Archane",
    kn: "ಅರ್ಚನೆ",
  },
  {
    id: "Abhisheka",
    price: 250,
    en: "Abhisheka",
    kn: "ಅಭಿಷೇಕ",
  },
  {
    id: "Sankashta - Monthly",
    price: 100,
    en: "Sankashta - Monthly",
    kn: "ಸಂಕಷ್ಟ ಚತುರ್ಥಿ",
  },
  {
    id: "Sankashta - Yearly",
    price: 1200,
    en: "Sankashta - Yearly",
    kn: "ಸಂಕಷ್ಟ ಚತುರ್ಥಿ - ವಾರ್ಷಿಕ",
  },
  {
    id: "Birthday/Anniversary",
    price: 250,
    en: "Special Puja: Birthday/Anniversary",
    kn: "ಜನ್ಮದಿನ/ ಮದುವೆ ವಾರ್ಷಿಕೋತ್ಸವ ವಿಶೇಷ ಪೂಜೆ",
  },
  {
    id: "Annadana",
    price: 0,
    en: "Annadana (Any Amount)",
    kn: "ಅನ್ನದಾನ (ನಿಮ್ಮ ಇಚ್ಛೆಯ ಮೊತ್ತ)",
    isCustom: true, // Only this triggers "Any Amount" text
  },
  {
    id: "Benne Alankara (No Butter)",
    price: 500,
    en: "Benne Alankara (Butter not included) [Devotees are required to bring 2kgs of butter]",
    kn: "ಬೆಣ್ಣೆ ಅಲಂಕಾರ (ಬೆಣ್ಣೆ ರಹಿತ) [ದಾನಿಗಳು 2 ಕಿ. ಗ್ರಾಂ. ಬೆಣ್ಣೆ ತರಬೇಕು]",
    note_en: "Devotees must bring 2kg butter",
    note_kn: "ಭಕ್ತರು 2 ಕೆಜಿ ಬೆಣ್ಣೆಯನ್ನು ತರಬೇಕು",
  },
  {
    id: "Benne Alankara (With Butter)",
    price: 1000,
    en: "Benne Alankara (Butter included)",
    kn: "ಬೆಣ್ಣೆ ಅಲಂಕಾರ (ಬೆಣ್ಣೆ ಸಹಿತ)",
  },
];

const adminStrings = {
  en: {
    active: "Active",
    switch: "Switch / Create New",
    cancel: "Cancel / Back",
    add_to: "Register for",
    phone: "Phone",
    add_btn: "Register Devotee",
    registered: "Registered Devotees",
    scan: "Scan to Pay",
    amount: "Amount",
    any_amount: "Any Amount",
    raashi: "Raashi",
    family_title: "Family Members",
    add_fam: "+ Add Member",
    fam_name: "Name",
    fam_nak: "Nakshatra",
  },
  kn: {
    active: "ಸಕ್ರಿಯ",
    switch: "ಬದಲಾಯಿಸಿ / ಹೊಸದನ್ನು ರಚಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ / ಹಿಂದಕ್ಕೆ",
    add_to: "ನೋಂದಾಯಿಸಿ:",
    phone: "ದೂರವಾಣಿ",
    add_btn: "ಭಕ್ತರನ್ನು ನೋಂದಾಯಿಸಿ",
    registered: "ನೋಂದಾಯಿತ ಭಕ್ತರು",
    scan: "ಪಾವತಿಸಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    amount: "ಮೊತ್ತ",
    any_amount: "ನಿಮ್ಮ ಇಚ್ಛೆಯ ಮೊತ್ತ",
    raashi: "ರಾಶಿ",
    family_title: "ಕುಟುಂಬ ಸದಸ್ಯರು",
    add_fam: "+ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ",
    fam_name: "ಹೆಸರು",
    fam_nak: "ನಕ್ಷತ್ರ",
  },
};

const SpecialPujaAdmin = ({ lang = "en" }) => {
  const [activePuja, setActivePuja] = useState(null);

  const [newType, setNewType] = useState(PUJA_OPTIONS[0].id);
  const [newDate, setNewDate] = useState("");

  const [devName, setDevName] = useState("");
  const [devGothra, setDevGothra] = useState("");
  const [devNakshatra, setDevNakshatra] = useState("");
  const [devRaashi, setDevRaashi] = useState("");
  const [devPhone, setDevPhone] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);

  const S = strings[lang];
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

  // --- HELPER: Handles Legacy "Sankashta" Mapping ---
  // This fixes the "Active: Sankashta" (English) issue and the Amount issue
  const getOptionDetails = (type) => {
    if (!type) return null;
    // Map old "Sankashta" to new "Sankashta - Monthly"
    if (type === "Sankashta") {
      return PUJA_OPTIONS.find((p) => p.id === "Sankashta - Monthly");
    }
    return PUJA_OPTIONS.find((p) => p.id === type);
  };

  const handleCreate = async () => {
    if (!newDate) return alert("Please pick a date");
    const dateObj = new Date(newDate);
    const dateStr = dateObj.toLocaleDateString("en-GB");

    // Always use the ID from the list
    await axios.post(`${API_URL}/special-puja/create`, {
      pujaType: newType,
      dateStr: dateStr,
    });
    fetchUpcoming();
    alert("New Event Created!");
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

  const handleAddDevotee = async (e) => {
    e.preventDefault();
    if (!activePuja) return alert("No active puja to add to.");

    // Use Helper to find price
    const currentOption = getOptionDetails(activePuja.pujaType);
    const finalPrice = currentOption ? currentOption.price : 0;

    await axios.post(`${API_URL}/special-puja/add-devotee`, {
      name: devName,
      gothra: devGothra,
      nakshatra: devNakshatra,
      raashi: devRaashi,
      phoneNumber: devPhone,
      amount: finalPrice,
      familyMembers: familyMembers,
    });

    setDevName("");
    setDevGothra("");
    setDevNakshatra("");
    setDevRaashi("");
    setDevPhone("");
    setFamilyMembers([]);
    fetchUpcoming();
  };

  // --- DISPLAY VARIABLES ---
  const currentOption = activePuja
    ? getOptionDetails(activePuja.pujaType)
    : null;
  // If not found, default to false so "Any Amount" doesn't show up for errors

  // Note Logic
  const note = lang === "kn" ? currentOption?.note_kn : currentOption?.note_en;

  // Dynamic Name (Handles translations properly now)
  const displayPujaName = currentOption
    ? lang === "kn"
      ? currentOption.kn
      : currentOption.en
    : activePuja?.pujaType || "";

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
          <h3>Create New Event:</h3>

          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            style={{ padding: "8px", marginRight: "10px", maxWidth: "200px" }}
          >
            {PUJA_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {lang === "kn" ? opt.kn : opt.en}
              </option>
            ))}
          </select>

          <input
            type="date"
            onChange={(e) => setNewDate(e.target.value)}
            style={{ padding: "8px", marginRight: "10px" }}
          />

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={handleCreate}
              style={{
                padding: "8px 16px",
                background: "#b8860b",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Create
            </button>
            <button
              onClick={fetchUpcoming}
              style={{
                padding: "8px 16px",
                background: "#ccc",
                color: "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              {A.cancel}
            </button>
          </div>
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
            <span style={{ color: "#d32f2f" }}>{displayPujaName}</span>{" "}
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
            {A.add_to} <br />
            <span style={{ color: "#d35400" }}>{displayPujaName}</span>
          </h3>

          {note && (
            <div
              style={{
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
                marginBottom: "10px",
                fontSize: "0.9rem",
              }}
            >
              ⚠️ {note}
            </div>
          )}

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
              <input
                placeholder={A.phone}
                value={devPhone}
                onChange={(e) => setDevPhone(e.target.value)}
                style={{ padding: "8px", gridColumn: "span 2" }}
              />
            </div>

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

          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              borderTop: "2px dashed #b8860b",
              paddingTop: "20px",
            }}
          >
            <h4 style={{ color: "#b8860b", margin: "0 0 10px 0" }}>{A.scan}</h4>
            <img
              // If isCustom, QR will not have pre-filled amount
              src="/kote qr.jpg"
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
