import React, { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from "lucide-react";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Agung Prasetyo",
      specialization: "Umum",
      phone: "08123456789",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Dr. Siti Rahayu",
      specialization: "Bedah",
      phone: "08234567890",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Dr. Budi Santoso",
      specialization: "Jantung",
      phone: "08345678901",
      status: "Cuti",
    },
    {
      id: 4,
      name: "Dr. Rina Wijaya",
      specialization: "Anak",
      phone: "08456789012",
      status: "Aktif",
    },
    {
      id: 5,
      name: "Dr. Hadi Gunawan",
      specialization: "Syaraf",
      phone: "08567890123",
      status: "Tidak Aktif",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState({
    id: null,
    name: "",
    specialization: "",
    phone: "",
    status: "Aktif",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const openModal = (doctor = null) => {
    if (doctor) {
      setCurrentDoctor(doctor);
      setIsEditing(true);
    } else {
      setCurrentDoctor({
        id: Date.now(),
        name: "",
        specialization: "",
        phone: "",
        status: "Aktif",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoctor({ ...currentDoctor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedDoctors = doctors.map((doctor) =>
        doctor.id === currentDoctor.id ? currentDoctor : doctor
      );
      setDoctors(updatedDoctors);
    } else {
      setDoctors([...doctors, currentDoctor]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus dokter ini?")) {
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manajemen Dokter</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari dokter..."
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
            Tambah Dokter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pl-4">{doctor.id}</td>
                  <td className="py-3">{doctor.name}</td>
                  <td className="py-3">{doctor.specialization}</td>
                  <td className="py-3">{doctor.phone}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${
                        doctor.status === "Aktif"
                          ? "bg-green-100 text-green-800"
                          : doctor.status === "Cuti"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => openModal(doctor)}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(doctor.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Dokter" : "Tambah Dokter Baru"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nama Dokter
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentDoctor.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Spesialisasi
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={currentDoctor.specialization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  No. Telepon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={currentDoctor.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={currentDoctor.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {isEditing ? "Simpan Perubahan" : "Tambah Dokter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
