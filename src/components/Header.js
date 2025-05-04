import React from "react";
import { BellIcon, UserCircleIcon, PlusSquareIcon, ActivityIcon } from "lucide-react";

const Header = ({ userRole }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 py-3 px-6 flex justify-between items-center fixed top-0 right-0 left-64 z-40">
      <div className="flex items-center">
        <ActivityIcon className="h-5 w-5 text-teal-600 mr-2" />
        <h1 className="text-lg font-medium text-gray-800">
          {userRole === "petugas" ? "Panel Petugas" : "Panel Dokter"}
        </h1>
        <span className="ml-2 px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-100">
          {userRole === "petugas" ? "Admin" : "Dokter"}
        </span>
      </div>
      
      <div className="flex items-center space-x-5">
        <div className="px-3 py-1 bg-teal-50 rounded-md border border-teal-100 text-teal-600 hidden md:flex items-center">
          <PlusSquareIcon className="h-4 w-4 mr-1.5" />
          <span className="text-sm font-medium">Bantuan Cepat</span>
        </div>
        
        <div className="relative">
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <BellIcon className="h-5 w-5 text-gray-600" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
              3
            </span>
          </button>
        </div>
        
        <div className="flex items-center pl-5 border-l border-gray-200">
          <div className="bg-teal-100 rounded-full h-9 w-9 flex items-center justify-center text-teal-700 font-medium mr-2.5">
            {userRole === "petugas" ? "A" : "D"}
          </div>
          <div>
            <p className="font-medium text-sm text-gray-800">
              {userRole === "petugas" ? "Admin" : "Dr. Contoh"}
            </p>
            <p className="text-xs text-gray-500">
              {userRole === "petugas" ? "Administrator" : "Dokter Umum"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;