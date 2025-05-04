import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DoctorManagement from "./components/DoctorManagement";
import TariffManagement from "./components/TariffManagement";
import RegistrationManagement from "./components/ManajemenPendaftaran";
import StaffManagement from "./components/StaffManagement";
import ReportManagement from "./components/ManajemenLaporan";
import MedicalRecordManagement from "./components/MedicalRecordManagement";
import DoctorPasswordEdit from "./components/DoctorPasswordManagement";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import VisitManagement from "./components/VisitManagement";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("");
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && (
          <Sidebar userRole={userRole} onLogout={handleLogout} />
        )}
        <div className="content">
          {isAuthenticated && (
            <Header userRole={userRole} onLogout={handleLogout} />
          )}
          <div className="main-content">
            <Routes>
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <Login onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <Dashboard userRole={userRole} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/doctor-management"
                element={
                  isAuthenticated && userRole === "petugas" ? (
                    <DoctorManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/tariff-management"
                element={
                  isAuthenticated && userRole === "petugas" ? (
                    <TariffManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/registration-management"
                element={
                  isAuthenticated && userRole === "petugas" ? (
                    <RegistrationManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/visit-management"
                element={
                  isAuthenticated && userRole === "petugas" ? (
                    <VisitManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/staff-management"
                element={
                  isAuthenticated && userRole === "petugas" ? (
                    <StaffManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/report-management"
                element={
                  isAuthenticated && userRole === "petugas" ? (
                    <ReportManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/medical-record-management"
                element={
                  isAuthenticated && userRole === "dokter" ? (
                    <MedicalRecordManagement />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/doctor-password-edit"
                element={
                  isAuthenticated && userRole === "dokter" ? (
                    <DoctorPasswordEdit />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
