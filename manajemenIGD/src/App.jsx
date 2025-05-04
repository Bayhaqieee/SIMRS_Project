import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/login.jsx";
import Dashboard from "./Pages/dashboard.jsx";
import Pendaftaran from "./Pages/pendaftaran.jsx"; // Impor PendaftaranPasien

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pendaftaran" element={<Pendaftaran />} /> {/* Rute untuk halaman pendaftaran */}
      </Routes>
    </Router>
  );
}

export default App;
