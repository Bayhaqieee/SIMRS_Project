import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockIcon } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 py-4">
          <h2 className="text-center text-2xl font-bold text-white">
            Sistem Manajemen IGD
          </h2>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Pilih Peran
              </label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="petugas"
                    value="petugas"
                    checked={role === "petugas"}
                    onChange={() => setRole("petugas")}
                    className="mr-2"
                  />
                  <label htmlFor="petugas">Petugas</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="dokter"
                    value="dokter"
                    checked={role === "dokter"}
                    onChange={() => setRole("dokter")}
                    className="mr-2"
                  />
                  <label htmlFor="dokter">Dokter</label>
                </div>
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <div className="flex items-center border rounded">
                <div className="px-3 py-2 bg-gray-100">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 focus:outline-none"
                  placeholder="Masukkan username anda"
                />
              </div>
            </div>
            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <div className="flex items-center border rounded">
                <div className="px-3 py-2 bg-gray-100">
                  <LockIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 focus:outline-none"
                  placeholder="Masukkan password anda"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            </div>
          </form>
          <div className="mt-6 text-sm text-center">
            <p>
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
