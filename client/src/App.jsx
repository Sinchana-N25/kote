import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PurohitView from "./PurohitView";
import DevoteeView from "./DevoteeView";

function App() {
  return (
    <BrowserRouter>
      {/* Temporary Nav for you to access pages */}
      <nav style={{ padding: "10px", background: "#eee", textAlign: "center" }}>
        <Link to="/" style={{ margin: "0 10px" }}>
          Devotee View
        </Link>{" "}
        |
        <Link to="/purohit" style={{ margin: "0 10px" }}>
          Purohit Admin
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<DevoteeView />} />
        <Route path="/purohit" element={<PurohitView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
