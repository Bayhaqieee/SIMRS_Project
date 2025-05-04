import React, { useState, useEffect } from "react";
import { Search, PlusCircle, Edit2, Trash2, Eye } from "lucide-react";

export default function ManajemenPendaftaran() {
  const [registrations, setRegistrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    patientName: "",
    patientId: "",
    registrationDate: "",
    doctorName: "",
    visitType: "",
    status: "Waiting",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch registrations data from API
    // This is a mock implementation
    const mockData = [
      {
        id: "1",
        patientName: "Budi Santoso",
        patientId: "P001",
        registrationDate: "2025-05-04",
        doctorName: "dr. Andi Wijaya",
        visitType: "General",
        status: "Completed",
      },
      {
        id: "2",
        patientName: "Siti Aminah",
        patientId: "P002",
        registrationDate: "2025-05-04",
        doctorName: "dr. Diana Putri",
        visitType: "Specialist",
        status: "Waiting",
      },
      {
        id: "3",
        patientName: "Agus Rahmat",
        patientId: "P003",
        registrationDate: "2025-05-04",
        doctorName: "dr. Budi Prakoso",
        visitType: "Emergency",
        status: "In Progress",
      },
    ];

    setRegistrations(mockData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.id) {
      // Update existing registration
      setRegistrations(
        registrations.map((reg) => (reg.id === formData.id ? formData : reg))
      );
    } else {
      // Add new registration
      const newId = (registrations.length + 1).toString();
      setRegistrations([...registrations, { ...formData, id: newId }]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const editRegistration = (registration) => {
    setFormData(registration);
    setIsModalOpen(true);
  };

  const viewRegistration = (registration) => {
    setCurrentRegistration(registration);
    setIsViewModalOpen(true);
  };

  const deleteRegistration = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pendaftaran ini?")) {
      setRegistrations(registrations.filter((reg) => reg.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      patientName: "",
      patientId: "",
      registrationDate: "",
      doctorName: "",
      visitType: "",
      status: "Waiting",
    });
  };

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Manajemen Pendaftaran</h1>
        <p className="text-gray-600">
          Kelola pendaftaran pasien untuk kunjungan medis
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Cari pendaftaran..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <PlusCircle className="mr-2" size={18} />
          Tambah Pendaftaran
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Pasien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Pasien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dokter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis Kunjungan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRegistrations.map((registration) => (
              <tr key={registration.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.patientId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.patientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.registrationDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.doctorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {registration.visitType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      registration.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : registration.status === "Waiting"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {registration.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => viewRegistration(registration)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => editRegistration(registration)}
                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteRegistration(registration.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {formData.id ? "Edit Pendaftaran" : "Tambah Pendaftaran Baru"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ID Pasien
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nama Pasien
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tanggal Pendaftaran
                </label>
                <input
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Dokter
                </label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Jenis Kunjungan
                </label>
                <select
                  name="visitType"
                  value={formData.visitType}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                >
                  <option value="">Pilih Jenis</option>
                  <option value="General">Umum</option>
                  <option value="Specialist">Spesialis</option>
                  <option value="Emergency">Darurat</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  required
                >
                  <option value="Waiting">Menunggu</option>
                  <option value="In Progress">Sedang Berlangsung</option>
                  <option value="Completed">Selesai</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {formData.id ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && currentRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Detail Pendaftaran</h2>

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID Pasien</p>
                  <p className="font-medium">{currentRegistration.patientId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama Pasien</p>
                  <p className="font-medium">
                    {currentRegistration.patientName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Pendaftaran</p>
                  <p className="font-medium">
                    {currentRegistration.registrationDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dokter</p>
                  <p className="font-medium">
                    {currentRegistration.doctorName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jenis Kunjungan</p>
                  <p className="font-medium">{currentRegistration.visitType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        currentRegistration.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : currentRegistration.status === "Waiting"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {currentRegistration.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
