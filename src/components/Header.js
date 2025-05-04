import React from "react";
import { BellIcon, UserCircleIcon } from "lucide-react";

const Header = ({ userRole }) => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        {userRole === "petugas" ? "Panel Petugas" : "Panel Dokter"}
      </h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-500" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </div>
        <div className="flex items-center">
          <UserCircleIcon className="h-8 w-8 text-gray-500 mr-2" />
          <span className="font-medium">
            {userRole === "petugas" ? "Admin" : "Dr. Contoh"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
