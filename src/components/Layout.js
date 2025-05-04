// Layout.js
import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = ({ children, userRole, onLogout }) => {
  const location = useLocation();

  // Check if the current route is login page
  const isLoginPage = location.pathname === "/";

  return (
    <div className="App">
      {/* Show sidebar only when not on login */}
      {!isLoginPage && <Sidebar userRole={userRole} onLogout={onLogout} />}

      {/* Apply margin only when sidebar is visible */}
      <div
        className="content"
        style={{ marginLeft: !isLoginPage ? "16rem" : "0" }}
      >
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;