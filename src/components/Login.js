import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockIcon, Activity } from "lucide-react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("petugas");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    // Mock authentication
    if (role === "petugas" && username === "admin" && password === "admin") {
      onLogin("petugas");
      navigate("/dashboard");
    } else if (
      role === "dokter" &&
      username === "dokter" &&
      password === "dokter"
    ) {
      onLogin("dokter");
      navigate("/dashboard");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {/* Header Section with Hospital Theme */}
        <div className="bg-teal-600 py-6 px-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Activity className="h-6 w-6 text-white" />
            <h2 className="text-center text-2xl font-semibold text-white">
              RS Medika
            </h2>
          </div>
          <p className="text-center text-teal-100 text-sm">Sistem Manajemen IGD</p>
        </div>
        
        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-3">
                Pilih Peran
              </label>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="petugas"
                    value="petugas"
                    checked={role === "petugas"}
                    onChange={() => setRole("petugas")}
                    className="mr-2 accent-teal-600"
                  />
                  <label htmlFor="petugas" className="text-gray-700">Petugas</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="dokter"
                    value="dokter"
                    checked={role === "dokter"}
                    onChange={() => setRole("dokter")}
                    className="mr-2 accent-teal-600"
                  />
                  <label htmlFor="dokter" className="text-gray-700">Dokter</label>
                </div>
              </div>
            </div>
            
            {/* Username Field */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Username
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                <div className="px-3 py-2 bg-gray-50 border-r border-gray-300 rounded-l-md">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 focus:outline-none rounded-r-md"
                  placeholder="Masukkan username anda"
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                <div className="px-3 py-2 bg-gray-50 border-r border-gray-300 rounded-l-md">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 focus:outline-none rounded-r-md"
                  placeholder="Masukkan password anda"
                />
              </div>
            </div>
            
            {/* Login Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              >
                Login
              </button>
            </div>
          </form>
          
          {/* Demo Credentials Box */}
          <div className="mt-8 text-xs text-center p-3 bg-gray-50 rounded-md border border-gray-100">
            <p className="text-gray-500 font-medium mb-1">Kredensial Demo</p>
            <p className="text-gray-600">
              Admin: username = admin, password = admin
              <br />
              Dokter: username = dokter, password = dokter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;