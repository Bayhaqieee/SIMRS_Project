import React, { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  EyeIcon,
} from "lucide-react";

const VisitManagement = () => {
  const [visits, setVisits] = useState([
    {
      id: "VST001",
      patientName: "Agus Sutanto",
      patientId: "P001",
      doctorName: "Dr. Bambang Wijaya",
      doctorId: "D001",
      visitDate: "2025-05-04",
      visitTime: "09:30",
      complaint: "Demam, sakit kepala",
      diagnosis: "Influenza",
      treatment: "Paracetamol 3x1, Istirahat cukup",
      notes: "Pasien alergi terhadap penisilin",
      status: "Selesai",
    },
    {
      id: "VST002",
      patientName: "Dewi Anggraini",
      patientId: "P002",
      doctorName: "Dr. Sri Mulyani",
      doctorId: "D002",
      visitDate: "2025-05-04",
      visitTime: "10:15",
      complaint: "Nyeri perut",
      diagnosis: "Gastritis",
      treatment: "Antasida 3x1, Diet lunak",
      notes: "",
      status: "Selesai",
    },
    {
      id: "VST003",
      patientName: "Budi Hartono",
      patientId: "P003",
      doctorName: "Dr. Joko Susilo",
      doctorId: "D003",
      visitDate: "2025-05-04",
      visitTime: "13:00",
      complaint: "Luka pada kaki",
      diagnosis: "Luka sayat",
      treatment: "Perawatan luka, Antibiotik",
      notes: "Perlu kontrol dalam 3 hari",
      status: "Dalam Proses",
    },
    {
      id: "VST004",
      patientName: "Rina Wati",
      patientId: "P004",
      doctorName: "Dr. Bambang Wijaya",
      doctorId: "D001",
      visitDate: "2025-05-04",
      visitTime: "14:30",
      complaint: "Batuk berdahak",
      diagnosis: "Belum diperiksa",
      treatment: "",
      notes: "",
      status: "Menunggu",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentVisit, setCurrentVisit] = useState({
    id: "",
    patientName: "",
    patientId: "",
    doctorName: "",
    doctorId: "",
    visitDate: "",
    visitTime: "",
    complaint: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    status: "Menunggu",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample doctors list - would come from API in real app
  const doctors = [
    { id: "D001", name: "Dr. Bambang Wijaya" },
    { id: "D002", name: "Dr. Sri Mulyani" },
    { id: "D003", name: "Dr. Joko Susilo" },
    { id: "D004", name: "Dr. Anita Permata" },
  ];

  // Sample patients list - would come from API in real app
  const patients = [
    { id: "P001", name: "Agus Sutanto" },
    { id: "P002", name: "Dewi Anggraini" },
    { id: "P003", name: "Budi Hartono" },
    { id: "P004", name: "Rina Wati" },
    { id: "P005", name: "Siti Aminah" },
  ];

  const generateId = () => {
    const lastId = visits.length > 0 ? visits[visits.length - 1].id : "VST000";
    const numericPart = parseInt(lastId.substring(3));
    return `VST${String(numericPart + 1).padStart(3, "0")}`;
  };

  const openModal = (visit = null) => {
    if (visit) {
      setCurrentVisit(visit);
      setIsEditing(true);
    } else {
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toTimeString().substring(0, 5);
      setCurrentVisit({
        id: generateId(),
        patientName: "",
        patientId: "",
        doctorName: "",
        doctorId: "",
        visitDate: today,
        visitTime: now,
        complaint: "",
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

    if (name === "patientId") {
      const selectedPatient = patients.find((patient) => patient.id === value);
      setCurrentVisit({
        ...currentVisit,
        patientId: value,
        patientName: selectedPatient ? selectedPatient.name : "",
      });
    } else if (name === "doctorId") {
      const selectedDoctor = doctors.find((doctor) => doctor.id === value);
      setCurrentVisit({
        ...currentVisit,
        doctorId: value,
        doctorName: selectedDoctor ? selectedDoctor.name : "",
      });
    } else {
      setCurrentVisit({ ...currentVisit, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedVisits = visits.map((visit) =>
        visit.id === currentVisit.id ? currentVisit : visit
      );
      setVisits(updatedVisits);
    } else {
      setVisits([...visits, currentVisit]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Apakah anda yakin ingin menghapus data kunjungan ini?")
    ) {
      setVisits(visits.filter((visit) => visit.id !== id));
    }
  };

  const filteredVisits = visits.filter(
    (visit) =>
      visit.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.status.toLowerCase().includes(searchTerm.toLowerCase())
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
              {filteredVisits.map((visit) => (
                <tr key={visit.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pl-4">{visit.id}</td>
                  <td className="py-3">{visit.patientName}</td>
                  <td className="py-3">{visit.doctorName}</td>
                  <td className="py-3">{visit.visitDate}</td>
                  <td className="py-3">{visit.visitTime}</td>
                  <td className="py-3">
                    {visit.complaint.length > 20
                      ? `${visit.complaint.substring(0, 20)}...`
                      : visit.complaint}
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
                      onClick={() => handleDelete(visit.id)}
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

      {/* Add/Edit Visit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Kunjungan" : "Tambah Kunjungan Baru"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ID Kunjungan
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={currentVisit.id}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Pasien
                  </label>
                  <select
                    name="patientId"
                    value={currentVisit.patientId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Pasien</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Dokter
                  </label>
                  <select
                    name="doctorId"
                    value={currentVisit.doctorId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Dokter</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
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
                    name="visitDate"
                    value={currentVisit.visitDate}
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
                    name="visitTime"
                    value={currentVisit.visitTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

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
                  <p className="font-semibold">{currentVisit.id}</p>
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
                    <p>{currentVisit.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Pasien</p>
                    <p>{currentVisit.patientId}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2">Informasi Dokter</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Nama Dokter</p>
                    <p>{currentVisit.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID Dokter</p>
                    <p>{currentVisit.doctorId}</p>
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
                    <p>{currentVisit.visitDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Waktu Kunjungan</p>
                    <p>{currentVisit.visitTime}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Keluhan</p>
                <p className="bg-gray-50 p-3 rounded">
                  {currentVisit.complaint || "-"}
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
