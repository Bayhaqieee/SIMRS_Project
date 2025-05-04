import React from "react";
import { Link } from "react-router-dom"; // Impor Link dari react-router-dom
import "./Dashboard.css";

const Dashboard = () => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Pendaftaran", path: "/pendaftaran" },
    { name: "Pembayaran", path: "#" },
    { name: "Rekam Medis", path: "#" },
    { name: "Kunjungan", path: "#" },
    { name: "Laporan", path: "#" },
    { name: "Dokter", path: "#" },
    { name: "Petugas", path: "#" },
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">IGD</h2>
        <nav className="menu">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} className="menu-item">
              {item.name}
            </Link>
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
