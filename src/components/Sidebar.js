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
  Activity,
} from "lucide-react";

const Sidebar = ({ userRole, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-teal-700 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto z-50 shadow-lg">
      <div className="p-5 border-b border-teal-600">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-white" />
          <h2 className="text-xl font-semibold">RS Medika</h2>
        </div>
        <p className="text-teal-200 text-xs mt-1 ml-8">Sistem Manajemen IGD</p>
      </div>
      
      <div className="mt-2 px-3">
        <p className="text-xs font-medium text-teal-300 px-4 py-2 uppercase tracking-wider">
          Menu Utama
        </p>
      </div>
      
      <nav className="mt-1">
        <Link
          to="/dashboard"
          className={`flex items-center px-4 py-3 mx-2 rounded-md hover:bg-teal-600 transition-colors ${
            isActive("/dashboard") 
              ? "bg-teal-800 text-white font-medium" 
              : "text-teal-100"
          }`}
        >
          <LayoutDashboardIcon className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </Link>

        {userRole === "petugas" && (
          <>
            <div className="mt-4 mb-2 px-3">
              <p className="text-xs font-medium text-teal-300 px-4 py-2 uppercase tracking-wider">
                Administrasi
              </p>
            </div>
            
            <Link
              to="/doctor-management"
              className={`flex items-center px-4 py-3 mx-2 rounded-md hover:bg-teal-600 transition-colors ${
                isActive("/doctor-management") 
                  ? "bg-teal-800 text-white font-medium" 
                  : "text-teal-100"
              }`}
            >
              <UserIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Dokter</span>
            </Link>
            
            <Link
              to="/tariff-management"
              className={`flex items-center px-4 py-3 mx-2 rounded-md hover:bg-teal-600 transition-colors ${
                isActive("/tariff-management") 
                  ? "bg-teal-800 text-white font-medium" 
                  : "text-teal-100"
              }`}
            >
              <DollarSignIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Tarif</span>
            </Link>
            
            <Link
              to="/registration-management"
              className={`flex items-center px-4 py-3 mx-2 rounded-md hover:bg-teal-600 transition-colors ${
                isActive("/registration-management") 
                  ? "bg-teal-800 text-white font-medium" 
                  : "text-teal-100"
              }`}
            >
              <ClipboardIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Pendaftaran</span>
            </Link>
            
            <Link
              to="/visit-management"
              className={`flex items-center px-4 py-3 mx-2 rounded-md hover:bg-teal-600 transition-colors ${
                isActive("/visit-management") 
                  ? "bg-teal-800 text-white font-medium" 
                  : "text-teal-100"
              }`}
            >
              <CalendarIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Kunjungan</span>
            </Link>
            
            <Link
              to="/staff-management"
              className={`flex items-center px-4 py-3 mx-2 rounded-md hover:bg-teal-600 transition-colors ${
                isActive("/staff-management") 
                  ? "bg-teal-800 text-white font-medium" 
                  : "text-teal-100"
              }`}
            >
              <UsersIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Petugas</span>
            </Link>
            
            <Link
              to="/report-management"
              className={`flex items-center px-4 py-3 mx-2 rounded-md hover:bg-teal-600 transition-colors ${
                isActive("/report-management") 
                  ? "bg-teal-800 text-white font-medium" 
                  : "text-teal-100"
              }`}
            >
              <FileTextIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Laporan</span>
            </Link>
          </>
        )}

        {userRole === "dokter" && (
          <>
            <div className="mt-4 mb-2 px-3">
              <p className="text-xs font-medium text-teal-300 px-4 py-2 uppercase tracking-wider">
                Akses Dokter
              </p>
            </div>
            
            <Link
              to="/medical-record-management"
              className={`flex items-center px-4 py-3 mx-2 rounded-md hover:bg-teal-600 transition-colors ${
                isActive("/medical-record-management") 
                  ? "bg-teal-800 text-white font-medium" 
                  : "text-teal-100"
              }`}
            >
              <FileIcon className="w-5 h-5 mr-3" />
              <span>Manajemen Rekam Medis</span>
            </Link>
            
            <Link
              to="/doctor-password-edit"
              className={`flex items-center px-4 py-3 mx-2 rounded-md hover:bg-teal-600 transition-colors ${
                isActive("/doctor-password-edit") 
                  ? "bg-teal-800 text-white font-medium" 
                  : "text-teal-100"
              }`}
            >
              <LockIcon className="w-5 h-5 mr-3" />
              <span>Edit Password Dokter</span>
            </Link>
          </>
        )}

        <div className="mt-4 mb-2 px-3">
          <p className="text-xs font-medium text-teal-300 px-4 py-2 uppercase tracking-wider">
            Akun
          </p>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-3 mx-2 text-teal-100 rounded-md hover:bg-teal-600 transition-colors w-full text-left"
        >
          <LogOutIcon className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;