import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserIcon,
  DollarSignIcon,
  ClipboardIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  FileIcon,
  LockIcon,
  LogOutIcon,
  LayoutDashboardIcon,
} from "lucide-react";

const Sidebar = ({ userRole, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-blue-800 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-5 border-b border-blue-700">
        <h2 className="text-xl font-bold">Manajemen IGD</h2>
      </div>
      <nav className="mt-5">
        <Link
          to="/dashboard"
          className={`flex items-center p-4 hover:bg-blue-700 ${
            isActive("/dashboard") ? "bg-blue-700" : ""
          }`}
        >
          <LayoutDashboardIcon className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </Link>

        {userRole === "petugas" && (
          <>
            <Link
              to="/doctor-management"
              className={`flex items-center p-4 hover:bg-blue-700 ${
                isActive("/doctor-management") ? "bg-blue-700" : ""
              }`}
            >
              <UserIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Dokter</span>
            </Link>
            <Link
              to="/tariff-management"
              className={`flex items-center p-4 hover:bg-blue-700 ${
                isActive("/tariff-management") ? "bg-blue-700" : ""
              }`}
            >
              <DollarSignIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Tarif</span>
            </Link>
            <Link
              to="/registration-management"
              className={`flex items-center p-4 hover:bg-blue-700 ${
                isActive("/registration-management") ? "bg-blue-700" : ""
              }`}
            >
              <ClipboardIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Pendaftaran</span>
            </Link>
            <Link
              to="/visit-management"
              className={`flex items-center p-4 hover:bg-blue-700 ${
                isActive("/visit-management") ? "bg-blue-700" : ""
              }`}
            >
              <CalendarIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Kunjungan</span>
            </Link>
            <Link
              to="/staff-management"
              className={`flex items-center p-4 hover:bg-blue-700 ${
                isActive("/staff-management") ? "bg-blue-700" : ""
              }`}
            >
              <UsersIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Petugas</span>
            </Link>
            <Link
              to="/report-management"
              className={`flex items-center p-4 hover:bg-blue-700 ${
                isActive("/report-management") ? "bg-blue-700" : ""
              }`}
            >
              <FileTextIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Laporan</span>
            </Link>
          </>
        )}

        {userRole === "dokter" && (
          <>
            <Link
              to="/medical-record-management"
              className={`flex items-center p-4 hover:bg-blue-700 ${
                isActive("/medical-record-management") ? "bg-blue-700" : ""
              }`}
            >
              <FileIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Rekam Medis</span>
            </Link>
            <Link
              to="/doctor-password-edit"
              className={`flex items-center p-4 hover:bg-blue-700 ${
                isActive("/doctor-password-edit") ? "bg-blue-700" : ""
              }`}
            >
              <LockIcon className="w-5 h-5 mr-3" />
              <span>Edit Password Dokter</span>
            </Link>
          </>
        )}

        <button
          onClick={onLogout}
          className="flex items-center p-4 hover:bg-blue-700 w-full text-left"
        >
          <LogOutIcon className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
