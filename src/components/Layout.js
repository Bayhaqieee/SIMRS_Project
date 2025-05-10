import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children, userRole, onLogout }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="App">
      {/* Sidebar */}
      {!isLoginPage && <Sidebar userRole={userRole} onLogout={onLogout} />}
      
      <div
        className="content"
        style={{ marginLeft: !isLoginPage ? "16rem" : "0" }}
      >
        {/* Header */}
        {!isLoginPage && <Header userRole={userRole} />}

        {/* Main content */}
        <div className="main-content pt-16 px-4 bg-gray-50 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;