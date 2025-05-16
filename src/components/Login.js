import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockIcon, Activity } from "lucide-react";
import supabase from "../supabaseClient";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("petugas"); // Default role, bisa disesuaikan
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("login")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .eq("role", role)
        .maybeSingle();

      console.log("Supabase result:", { data, error });

      if (error) {
        console.error("Supabase error details:", error);
        setError("Username atau password salah");
      } else if (!data) {
        setError("Username atau password salah");
      } else {
        // Login berhasil, arahkan ke dashboard dan beri tahu App.js tentang status login
        onLogin(role); // Kirim role ke App.js
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <div className="bg-teal-600 py-6 px-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Activity className="h-6 w-6 text-white" />
            <h2 className="text-center text-2xl font-semibold text-white">
              RS Medika
            </h2>
          </div>
          <p className="text-center text-teal-100 text-sm">Sistem Manajemen IGD</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-3">
                Pilih Peran
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="petugas"
                    checked={role === "petugas"}
                    onChange={() => setRole("petugas")}
                    className="h-4 w-4 text-teal-500"
                  />
                  <span className="ml-2">Petugas</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="dokter"
                    checked={role === "dokter"}
                    onChange={() => setRole("dokter")}
                    className="h-4 w-4 text-teal-500"
                  />
                  <span className="ml-2">Dokter</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan Username"
                className="w-full p-3 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password"
                className="w-full p-3 border rounded-md shadow-sm"
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-3 rounded-md"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
