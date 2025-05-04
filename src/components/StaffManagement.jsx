// src/components/StaffManagement.js
import React, { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  KeyIcon,
} from "lucide-react";

const StaffManagement = () => {
  const [staff, setStaff] = useState([
    {
      id: "STF001",
      name: "Darmawan",
      nik: "3301234567890010",
      role: "Admin",
      email: "darmawan@klinik.com",
      phone: "081234567890",
      address: "Jl. Merdeka No. 45, Jakarta",
      joinDate: "2023-01-10",
      status: "Aktif",
    },
    {
      id: "STF002",
      name: "Sinta Dewi",
      nik: "3301234567890011",
      role: "Perawat",
      email: "sinta@klinik.com",
      phone: "081234567891",
      address: "Jl. Pahlawan No. 12, Jakarta",
      joinDate: "2023-02-15",
      status: "Aktif",
    },
    {
      id: "STF003",
      name: "Bagus Prakoso",
      nik: "3301234567890012",
      role: "Apoteker",
      email: "bagus@klinik.com",
      phone: "081234567892",
      address: "Jl. Sudirman No. 78, Jakarta",
      joinDate: "2023-03-20",
      status: "Aktif",
    },
    {
      id: "STF004",
      name: "Maya Sari",
      nik: "3301234567890013",
      role: "Resepsionis",
      email: "maya@klinik.com",
      phone: "081234567893",
      address: "Jl. Gatot Subroto No. 33, Jakarta",
      joinDate: "2023-04-05",
      status: "Cuti",
    },
    {
      id: "STF005",
      name: "Rudi Santoso",
      nik: "3301234567890014",
      role: "Teknisi Lab",
      email: "rudi@klinik.com",
      phone: "081234567894",
      address: "Jl. Asia Afrika No. 56, Jakarta",
      joinDate: "2023-05-12",
      status: "Tidak Aktif",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    id: "",
    name: "",
    nik: "",
    role: "Admin",
    email: "",
    phone: "",
    address: "",
    joinDate: "",
    status: "Aktif",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const roles = ["Admin", "Perawat", "Apoteker", "Resepsionis", "Teknisi Lab"];
  const statusOptions = ["Aktif", "Cuti", "Tidak Aktif"];

  const generateId = () => {
    const lastId = staff.length > 0 ? staff[staff.length - 1].id : "STF000";
    const numericPart = parseInt(lastId.substring(3));
    return `STF${String(numericPart + 1).padStart(3, "0")}`;
  };

  const openModal = (staffMember = null) => {
    if (staffMember) {
      setCurrentStaff(staffMember);
      setIsEditing(true);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setCurrentStaff({
        id: generateId(),
        name: "",
        nik: "",
        role: "Admin",
        email: "",
        phone: "",
        address: "",
        joinDate: today,
        status: "Aktif",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const openPasswordModal = (staffMember) => {
    setCurrentStaff(staffMember);
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setIsPasswordModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStaff({ ...currentStaff, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedStaff = staff.map((s) =>
        s.id === currentStaff.id ? currentStaff : s
      );
      setStaff(updatedStaff);
    } else {
      setStaff([...staff, currentStaff]);
    }
    closeModal();
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Password validation
    if (password.length < 8) {
      setPasswordError("Password harus minimal 8 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Password dan konfirmasi password tidak cocok");
      return;
    }

    // In a real app, you would update the password in the backend
    // For demo purposes, we'll just show an alert
    alert(`Password untuk ${currentStaff.name} telah diubah`);

    closePasswordModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus petugas ini?")) {
      setStaff(staff.filter((s) => s.id !== id));
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Aktif":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Aktif
          </span>
        );
      case "Cuti":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Cuti
          </span>
        );
      case "Tidak Aktif":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Tidak Aktif
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manajemen Petugas</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari petugas..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => openModal()}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah Petugas
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 pl-4">ID</th>
                <th className="pb-3">Nama</th>
                <th className="pb-3">Jabatan</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Telepon</th>
                <th className="pb-3">Tanggal Bergabung</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pl-4">{s.id}</td>
                  <td className="py-3">{s.name}</td>
                  <td className="py-3">{s.role}</td>
                  <td className="py-3">{s.email}</td>
                  <td className="py-3">{s.phone}</td>
                  <td className="py-3">{s.joinDate}</td>
                  <td className="py-3">{getStatusBadge(s.status)}</td>
                  <td className="py-3 text-right">
                    <button
                      className="text-green-600 hover:text-green-800 mr-3"
                      onClick={() => openPasswordModal(s)}
                      title="Reset Password"
                    >
                      <KeyIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => openModal(s)}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(s.id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Petugas" : "Tambah Petugas Baru"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ID Petugas
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={currentStaff.id}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentStaff.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    NIK
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={currentStaff.nik}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Jabatan
                  </label>
                  <select
                    name="role"
                    value={currentStaff.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={currentStaff.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={currentStaff.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Alamat
                  </label>
                  <textarea
                    name="address"
                    value={currentStaff.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tanggal Bergabung
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={currentStaff.joinDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={currentStaff.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg mr-2"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Reset Password - {currentStaff.name}
            </h3>

            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {passwordError && (
                  <div className="text-red-500 text-sm">{passwordError}</div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg mr-2"
                  onClick={closePasswordModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Simpan Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
