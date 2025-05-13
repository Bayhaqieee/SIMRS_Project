import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from "lucide-react";
import supabase from "../supabaseClient"; 

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState({
    id_dokter: null,
    nama: "",
    spesialisasi: "",
    telepon: "",
    status: "Aktif", // Default value set to "Aktif"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from Supabase when component mounts
 useEffect(() => {
  const fetchDoctors = async () => {
    console.log('Fetching doctors from Supabase...');
    const { data, error } = await supabase.from("dokter").select("*");
    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      console.log("Fetched Doctors:", data); 
      setDoctors(data);
    }
  };
  fetchDoctors();
}, []);

  // For debugging state updates
  useEffect(() => {
    console.log("Doctors state updated:", doctors);
  }, [doctors]);

  const openModal = (doctor = null) => {
    if (doctor) {
      setCurrentDoctor(doctor);
      setIsEditing(true);
    } else {
      setCurrentDoctor({
        id_dokter: Date.now(),
        nama: "",
        spesialisasi: "",
        telepon: "",
        status: "Aktif", // Default value set to "Aktif"
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoctor({ ...currentDoctor, [name]: value });
  };

  // Handle form submit (add or edit doctor)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedDoctors = doctors.map((doctor) =>
        doctor.id_dokter === currentDoctor.id_dokter ? currentDoctor : doctor
      );
      setDoctors(updatedDoctors);
    } else {
      // Adding new doctor to Supabase
      const { error } = await supabase.from("dokter").insert([currentDoctor]);
      if (error) {
        console.error("Error adding doctor:", error.message);
      } else {
        setDoctors([...doctors, currentDoctor]);
      }
    }
    closeModal();
  };

  // Handle doctor delete
  const handleDelete = async (id_dokter) => {
    if (window.confirm("Apakah anda yakin ingin menghapus dokter ini?")) {
      // Delete from Supabase
      const { error } = await supabase.from("dokter").delete().eq("id_dokter", id_dokter);
      if (error) {
        console.error("Error deleting doctor:", error.message);
      } else {
        setDoctors(doctors.filter((doctor) => doctor.id_dokter !== id_dokter));
      }
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.spesialisasi.toLowerCase().includes(searchTerm.toLowerCase())
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
                <th className="pb-3">ID Dokter</th>
                <th className="pb-3">Nama</th>
                <th className="pb-3">Spesialisasi</th>
                <th className="pb-3">No. Telepon</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id_dokter} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => openModal(doctor)}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(doctor.id_dokter)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="py-3 pl-4">{doctor.id_dokter}</td>
                  <td className="py-3">{doctor.nama}</td>
                  <td className="py-3">{doctor.spesialisasi}</td>
                  <td className="py-3">{doctor.telepon}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${doctor.status === "Aktif"
                          ? "bg-green-100 text-green-800"
                          : doctor.status === "Cuti"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"}`}
                    >
                      {doctor.status}
                    </span>
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
                  name="nama"
                  value={currentDoctor.nama}
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
                  name="spesialisasi"
                  value={currentDoctor.spesialisasi}
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
                  name="telepon"
                  value={currentDoctor.telepon}
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
