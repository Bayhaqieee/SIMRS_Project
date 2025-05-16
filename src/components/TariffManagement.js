// src/components/TariffManagement.js
import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from "lucide-react";
import supabase from "../supabaseClient";

const TariffManagement = () => {
  const [tariffs, setTariffs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTariff, setCurrentTariff] = useState({
    id_tarif: "",
    nama_layanan: "",
    kategori: "",
    harga: "",
    deskripsi: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "Konsultasi",
    "Laboratorium",
    "Radiologi",
    "Rawat Inap",
    "Tindakan Medis",
    "Lainnya",
  ];

  // Fetch all tariffs from Supabase
  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tarif")
        .select("*")
        .order("id_tarif", { ascending: true });

      if (error) {
        throw error;
      }

      setTariffs(data);
    } catch (error) {
      console.error("Error fetching tariffs:", error.message);
      setError("Gagal memuat data tarif");
    } finally {
      setLoading(false);
    }
  };

  // Load tariffs on component mount
  useEffect(() => {
    fetchTariffs();
  }, []);

  const generateId = async () => {
    try {
      // Get the highest id from Supabase
      const { data, error } = await supabase
        .from("tarif")
        .select("id_tarif")
        .order("id_tarif", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        // Increment the highest ID by 1
        return parseInt(data[0].id_tarif) + 1;
      } else {
        return 1001; // First entry starts at 1001
      }
    } catch (error) {
      console.error("Error generating ID:", error.message);
      return new Date().getTime(); // Fallback to timestamp-based ID
    }
  };

  const openModal = async (tariff = null) => {
    if (tariff) {
      setCurrentTariff({
        id_tarif: tariff.id_tarif,
        nama_layanan: tariff.nama_layanan,
        kategori: tariff.kategori,
        harga: tariff.harga,
        deskripsi: tariff.deskripsi,
      });
      setIsEditing(true);
    } else {
      const newId = await generateId();
      setCurrentTariff({
        id_tarif: newId,
        nama_layanan: "",
        kategori: "Konsultasi",
        harga: 0,
        deskripsi: "",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Format harga input with thousand separator
  const formatHargaInput = (value) => {
    // Remove non-digit characters
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Format with thousand separator
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "harga") {
      // Format the price with thousand separator
      const formattedValue = formatHargaInput(value);
      setCurrentTariff({
        ...currentTariff,
        [name]: formattedValue,
      });
    } else {
      setCurrentTariff({
        ...currentTariff,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert harga to integer for database storage
      const hargaValue = currentTariff.harga ? parseInt(currentTariff.harga.replace(/[^\d]/g, '')) : 0;
      
      if (isEditing) {
        // Update existing tariff
        const { error } = await supabase
          .from("tarif")
          .update({
            nama_layanan: currentTariff.nama_layanan,
            kategori: currentTariff.kategori,
            harga: hargaValue,
            deskripsi: currentTariff.deskripsi,
          })
          .eq("id_tarif", currentTariff.id_tarif);

        if (error) throw error;
      } else {
        // Insert new tariff
        const { error } = await supabase
          .from("tarif")
          .insert([
            {
              id_tarif: currentTariff.id_tarif,
              nama_layanan: currentTariff.nama_layanan,
              kategori: currentTariff.kategori,
              harga: hargaValue,
              deskripsi: currentTariff.deskripsi,
            },
          ]);

        if (error) throw error;
      }
      
      // Refresh tariff list
      fetchTariffs();
      closeModal();
    } catch (error) {
      console.error("Error saving tariff:", error.message);
      alert(`Gagal menyimpan data: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus tarif ini?")) {
      try {
        const { error } = await supabase
          .from("tarif")
          .delete()
          .eq("id_tarif", id);

        if (error) throw error;
        
        // Refresh tariff list
        fetchTariffs();
      } catch (error) {
        console.error("Error deleting tariff:", error.message);
        alert(`Gagal menghapus data: ${error.message}`);
      }
    }
  };

  const filteredTariffs = tariffs.filter(
    (tariff) =>
      tariff.nama_layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tariff.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tariff.id_tarif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button 
            className="mt-2 text-blue-600 hover:underline"
            onClick={fetchTariffs}
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manajemen Tarif</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari tarif..."
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
            Tambah Tarif
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Memuat data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 pl-4">ID</th>
                  <th className="pb-3">Nama Layanan</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Harga</th>
                  <th className="pb-3">Deskripsi</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTariffs.length > 0 ? (
                  filteredTariffs.map((tariff) => (
                    <tr key={tariff.id_tarif} className="border-b hover:bg-gray-50">
                      <td className="py-3 pl-4">{tariff.id_tarif}</td>
                      <td className="py-3">{tariff.nama_layanan}</td>
                      <td className="py-3">{tariff.kategori}</td>
                      <td className="py-3">{formatCurrency(tariff.harga)}</td>
                      <td className="py-3">
                        {tariff.deskripsi && tariff.deskripsi.length > 30
                          ? `${tariff.deskripsi.substring(0, 30)}...`
                          : tariff.deskripsi}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          onClick={() => openModal(tariff)}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(tariff.id_tarif)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      {searchTerm 
                        ? "Tidak ada tarif yang sesuai dengan pencarian" 
                        : "Belum ada data tarif. Klik 'Tambah Tarif' untuk menambahkan data."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Tarif" : "Tambah Tarif Baru"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ID Tarif
                  </label>
                  <input
                    type="text"
                    name="id_tarif"
                    value={currentTariff.id_tarif}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nama Layanan
                  </label>
                  <input
                    type="text"
                    name="nama_layanan"
                    value={currentTariff.nama_layanan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    value={currentTariff.kategori}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Harga (Rp)
                  </label>
                  <input
                    type="text"
                    name="harga"
                    value={currentTariff.harga}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Contoh: 150000"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={currentTariff.deskripsi}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
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
    </div>
  );
};

export default TariffManagement;