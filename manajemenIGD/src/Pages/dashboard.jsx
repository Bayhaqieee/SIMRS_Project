import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const menuItems = [
    "Dashboard",
    "Pendaftaran",
    "Pembayaran",
    "Rekam Medis",
    "Kunjungan",
    "Laporan",
    "Dokter",
    "Petugas",
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">IGD</h2>
        <nav className="menu">
          {menuItems.map((item, index) => (
            <a key={index} href="#" className="menu-item">
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <h1>Selamat Datang di Dashboard</h1>
      </main>
    </div>
  );
};

export default Dashboard;
