import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  EyeIcon,
} from "lucide-react";
import supabase from "../supabaseClient";

const VisitManagement = () => {
  const [visits, setVisits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentVisit, setCurrentVisit] = useState({
    id_kunjungan: "",
    pasien: "",
    dokter: "",
    tanggal: "",
    waktu: "",
    keluhan: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    status: "Menunggu",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch visits from Supabase
  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("kunjungan")
        .select("*")
        .order("tanggal", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setVisits(data);
      }
    } catch (error) {
      console.error("Error fetching visits:", error.message);
      alert("Error fetching visits: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (visit = null) => {
    if (visit) {
      setCurrentVisit(visit);
      setIsEditing(true);
    } else {
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toTimeString().substring(0, 5);
      setCurrentVisit({
        id_kunjungan: "",  // Supabase will auto-generate this as int8
        pasien: "",
        dokter: "",
        tanggal: today,
        waktu: now,
        keluhan: "",
        diagnosis: "",
        treatment: "",
        notes: "",
        status: "Menunggu",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const openDetailModal = (visit) => {
    setCurrentVisit(visit);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVisit({ ...currentVisit, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing visit
        const { error } = await supabase
          .from("kunjungan")
          .update({
            pasien: currentVisit.pasien,
            dokter: currentVisit.dokter,
            tanggal: currentVisit.tanggal,
            waktu: currentVisit.waktu,
            keluhan: currentVisit.keluhan,
            diagnosis: currentVisit.diagnosis,
            treatment: currentVisit.treatment,
            notes: currentVisit.notes,
            status: currentVisit.status
          })
          .eq("id_kunjungan", currentVisit.id_kunjungan);

        if (error) throw error;
        alert("Kunjungan berhasil diperbarui!");
      } else {
        // Create new visit
        const { error } = await supabase.from("kunjungan").insert([
          {
            pasien: currentVisit.pasien,
            dokter: currentVisit.dokter,
            tanggal: currentVisit.tanggal,
            waktu: currentVisit.waktu,
            keluhan: currentVisit.keluhan,
            diagnosis: currentVisit.diagnosis || "",
            treatment: currentVisit.treatment || "",
            notes: currentVisit.notes || "",
            status: currentVisit.status
          },
        ]);

        if (error) throw error;
        alert("Kunjungan baru berhasil ditambahkan!");
      }

      // Refresh the visits list
      fetchVisits();
      closeModal();
    } catch (error) {
      console.error("Error saving visit:", error.message);
      alert("Error saving visit: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus data kunjungan ini?")) {
      try {
        const { error } = await supabase
          .from("kunjungan")
          .delete()
          .eq("id_kunjungan", id);

        if (error) throw error;
        
        // Refresh the visits list
        fetchVisits();
        alert("Kunjungan berhasil dihapus!");
      } catch (error) {
        console.error("Error deleting visit:", error.message);
        alert("Error deleting visit: " + error.message);
      }
    }
  };

  const filteredVisits = visits.filter(
    (visit) =>
      visit.pasien?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.dokter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.id_kunjungan?.toString().includes(searchTerm.toLowerCase()) ||
      visit.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Menunggu":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Menunggu
          </span>
        );
      case "Dalam Proses":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Dalam Proses
          </span>
        );
      case "Selesai":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manajemen Kunjungan</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari kunjungan..."
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
            Tambah Kunjungan
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 pl-4">ID</th>
                  <th className="pb-3">Pasien</th>
                  <th className="pb-3">Dokter</th>
                  <th className="pb-3">Tanggal</th>
                  <th className="pb-3">Waktu</th>
                  <th className="pb-3">Keluhan</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => (
                    <tr key={visit.id_kunjungan} className="border-b hover:bg-gray-50">
                      <td className="py-3 pl-4">{visit.id_kunjungan}</td>
                      <td className="py-3">{visit.pasien}</td>
                      <td className="py-3">{visit.dokter}</td>
                      <td className="py-3">{visit.tanggal}</td>
                      <td className="py-3">{visit.waktu}</td>
                      <td className="py-3">
                        {visit.keluhan && visit.keluhan.length > 20
                          ? `${visit.keluhan.substring(0, 20)}...`
                          : visit.keluhan}
                      </td>
                      <td className="py-3">{getStatusBadge(visit.status)}</td>
                      <td className="py-3 text-right">
                        <button
                          className="text-green-600 hover:text-green-800 mr-3"
                          onClick={() => openDetailModal(visit)}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          onClick={() => openModal(visit)}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(visit.id_kunjungan)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-4 text-center text-gray-500">
                      Tidak ada data kunjungan yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Visit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Kunjungan" : "Tambah Kunjungan Baru"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditing && (
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      ID Kunjungan
                    </label>
                    <input
                      type="text"
                      name="id_kunjungan"
                      value={currentVisit.id_kunjungan}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                      disabled
                    />
                  </div>
                )}

                <div className={isEditing ? "" : "md:col-span-2"}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Pasien
                  </label>
                  <input
                    type="text"
                    name="pasien"
                    value={currentVisit.pasien}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama pasien"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Dokter
                  </label>
                  <input
                    type="text"
                    name="dokter"
                    value={currentVisit.dokter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama dokter"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={currentVisit.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tanggal Kunjungan
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={currentVisit.tanggal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Waktu Kunjungan
                  </label>
                  <input
                    type="time"
                    name="waktu"
                    value={currentVisit.waktu}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Keluhan
                  </label>
                  <textarea
                    name="keluhan"
                    value={currentVisit.keluhan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    required
                  />
                </div>

                {currentVisit.status === "Dalam Proses" || currentVisit.status === "Selesai" ? (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Diagnosis
                      </label>
                      <textarea
                        name="diagnosis"
                        value={currentVisit.diagnosis}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tindakan/Pengobatan
                      </label>
                      <textarea
                        name="treatment"
                        value={currentVisit.treatment}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                      />
                    </div>
                  </>
                ) : null}

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Catatan
                  </label>
                  <textarea
                    name="notes"
                    value={currentVisit.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
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

      {/* Visit Detail Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Detail Kunjungan</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeDetailModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID Kunjungan</p>
                  <p className="font-semibold">{currentVisit.id_kunjungan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div>{getStatusBadge(currentVisit.status)}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-lg mb-2">Informasi Pasien</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Nama Pasien</p>
                    <p>{currentVisit.pasien}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2">Informasi Dokter</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Nama Dokter</p>
                    <p>{currentVisit.dokter}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-bold text-lg mb-2">Informasi Kunjungan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
                    <p>{currentVisit.tanggal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Waktu Kunjungan</p>
                    <p>{currentVisit.waktu}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Keluhan</p>
                <p className="bg-gray-50 p-3 rounded">
                  {currentVisit.keluhan || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Diagnosis</p>
                <p className="bg-gray-50 p-3 rounded">
                  {currentVisit.diagnosis || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Tindakan/Pengobatan</p>
                <p className="bg-gray-50 p-3 rounded">
                  {currentVisit.treatment || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Catatan</p>
                <p className="bg-gray-50 p-3 rounded">
                  {currentVisit.notes || "-"}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg"
                onClick={closeDetailModal}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitManagement;