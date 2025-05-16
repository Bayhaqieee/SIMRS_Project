// src/components/StaffManagement.jsx
import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  KeyIcon,
} from "lucide-react";
import supabase from "../supabaseClient";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    id_petugas: "",
    nama_petugas: "",
    telepon: "",
    jabatan: "Admin",
    email: "",
    tanggalbergabung: "",
    status: "Aktif",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const roles = ["Admin", "Perawat", "Apoteker", "Resepsionis", "Teknisi Lab"];
  const statusOptions = ["Aktif", "Cuti", "Tidak Aktif"];

  // Fetch staff data from Supabase on component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('petugas')
        .select('*')
        .order('id_petugas', { ascending: true });
      
      if (error) throw error;
      
      console.log("Data dari Supabase:", data); // Untuk debugging
      setStaff(data || []);
    } catch (error) {
      console.error("Error fetching staff:", error.message);
      setError("Gagal memuat data petugas");
    } finally {
      setIsLoading(false);
    }
  };

  const generateId = () => {
    // Membuat ID numerik untuk tipe data bigint
    if (staff.length === 0) {
      return 1001; // ID awal jika tidak ada data
    }
    
    try {
      // Mencari id_petugas tertinggi
      const lastStaffId = staff.reduce((maxId, current) => {
        const currentId = parseInt(current.id_petugas) || 0;
        return currentId > maxId ? currentId : maxId;
      }, 0);
      
      // ID baru = ID tertinggi + 1
      return lastStaffId + 1;
    } catch (error) {
      console.error("Error generating ID:", error);
      // Fallback jika terjadi kesalahan
      return Math.floor(Math.random() * 9000) + 1000; // ID random 1000-9999
    }
  };

  const openModal = (staffMember = null) => {
    if (staffMember) {
      setCurrentStaff(staffMember);
      setIsEditing(true);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setCurrentStaff({
        id_petugas: generateId(),
        nama_petugas: "",
        telepon: "",
        jabatan: "Admin",
        email: "",
        tanggalbergabung: today,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Buat salinan dari objek currentStaff untuk mengirim ke Supabase
      const staffData = { ...currentStaff };
      
      // Pastikan id_petugas berupa angka, bukan string
      if (!isEditing) {
        staffData.id_petugas = parseInt(staffData.id_petugas);
      }
      
      console.log("Data yang akan disimpan:", staffData); // Untuk debugging
      
      if (isEditing) {
        // Update existing staff member
        const { data, error } = await supabase
          .from('petugas')
          .update({
            nama_petugas: staffData.nama_petugas,
            telepon: staffData.telepon,
            jabatan: staffData.jabatan,
            email: staffData.email,
            tanggalbergabung: staffData.tanggalbergabung,
            status: staffData.status
          })
          .eq('id_petugas', staffData.id_petugas);
        
        if (error) throw error;
        
        console.log("Data berhasil diupdate:", data);
        
      } else {
        // Insert new staff member
        const { data, error } = await supabase
          .from('petugas')
          .insert([staffData]);
        
        if (error) throw error;
        
        console.log("Data berhasil ditambahkan:", data);
      }
      
      // Refresh data from server
      closeModal();
      fetchStaff();
      
    } catch (error) {
      console.error("Error saving staff:", error);
      alert("Gagal menyimpan data petugas: " + error.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
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

    try {
      // In a real app using Supabase Auth, you would use something like:
      // const { error } = await supabase.auth.admin.updateUserById(
      //   userId,
      //   { password: password }
      // );
      
      // For demo purposes:
      alert(`Password untuk ${currentStaff.nama_petugas} telah diubah`);
      closePasswordModal();
      
    } catch (error) {
      console.error("Error updating password:", error.message);
      setPasswordError("Gagal mengubah password: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus petugas ini?")) {
      try {
        const { error } = await supabase
          .from('petugas')
          .delete()
          .eq('id_petugas', id);
        
        if (error) throw error;
        
        // Update local state
        setStaff(staff.filter(s => s.id_petugas !== id));
        
      } catch (error) {
        console.error("Error deleting staff:", error.message);
        alert("Gagal menghapus petugas: " + error.message);
      }
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.nama_petugas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.id_petugas?.toString().includes(searchTerm)) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Utility untuk menampilkan ID dengan format STF di tampilan
  const formatIdDisplay = (id) => {
    return `STF${id}`;
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

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Memuat data petugas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
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
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-4 text-center text-gray-500">
                      Tidak ada data petugas yang ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((s) => (
                    <tr key={s.id_petugas} className="border-b hover:bg-gray-50">
                      <td className="py-3 pl-4">{formatIdDisplay(s.id_petugas)}</td>
                      <td className="py-3">{s.nama_petugas}</td>
                      <td className="py-3">{s.jabatan}</td>
                      <td className="py-3">{s.email}</td>
                      <td className="py-3">{s.telepon}</td>
                      <td className="py-3">{s.tanggalbergabung}</td>
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
                          onClick={() => handleDelete(s.id_petugas)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
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
                    name="id_petugas"
                    value={isEditing ? formatIdDisplay(currentStaff.id_petugas) : formatIdDisplay(currentStaff.id_petugas)}
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
                    name="nama_petugas"
                    value={currentStaff.nama_petugas}
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
                    name="jabatan"
                    value={currentStaff.jabatan}
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
                    name="telepon"
                    value={currentStaff.telepon}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tanggal Bergabung
                  </label>
                  <input
                    type="date"
                    name="tanggalbergabung"
                    value={currentStaff.tanggalbergabung}
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
              Reset Password - {currentStaff.nama_petugas}
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