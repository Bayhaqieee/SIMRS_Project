// src/components/TariffManagement.js
import React, { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from "lucide-react";

const TariffManagement = () => {
  const [tariffs, setTariffs] = useState([
    {
      id: "TRF001",
      serviceName: "Konsultasi Umum",
      category: "Konsultasi",
      price: 150000,
      description: "Konsultasi dengan dokter umum",
    },
    {
      id: "TRF002",
      serviceName: "Konsultasi Spesialis",
      category: "Konsultasi",
      price: 300000,
      description: "Konsultasi dengan dokter spesialis",
    },
    {
      id: "TRF003",
      serviceName: "Cek Darah Lengkap",
      category: "Laboratorium",
      price: 250000,
      description: "Pemeriksaan darah lengkap",
    },
    {
      id: "TRF004",
      serviceName: "Rontgen Dada",
      category: "Radiologi",
      price: 500000,
      description: "Rontgen untuk area dada",
    },
    {
      id: "TRF005",
      serviceName: "Rawat Inap (per hari)",
      category: "Rawat Inap",
      price: 750000,
      description: "Biaya kamar rawat inap standar per hari",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTariff, setCurrentTariff] = useState({
    id: "",
    serviceName: "",
    category: "",
    price: 0,
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "Konsultasi",
    "Laboratorium",
    "Radiologi",
    "Rawat Inap",
    "Tindakan Medis",
    "Lainnya",
  ];

  const generateId = () => {
    const lastId =
      tariffs.length > 0 ? tariffs[tariffs.length - 1].id : "TRF000";
    const numericPart = parseInt(lastId.substring(3));
    return `TRF${String(numericPart + 1).padStart(3, "0")}`;
  };

  const openModal = (tariff = null) => {
    if (tariff) {
      setCurrentTariff(tariff);
      setIsEditing(true);
    } else {
      setCurrentTariff({
        id: generateId(),
        serviceName: "",
        category: "Konsultasi",
        price: 0,
        description: "",
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
    setCurrentTariff({
      ...currentTariff,
      [name]: name === "price" ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedTariffs = tariffs.map((tariff) =>
        tariff.id === currentTariff.id ? currentTariff : tariff
      );
      setTariffs(updatedTariffs);
    } else {
      setTariffs([...tariffs, currentTariff]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus tarif ini?")) {
      setTariffs(tariffs.filter((tariff) => tariff.id !== id));
    }
  };

  const filteredTariffs = tariffs.filter(
    (tariff) =>
      tariff.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tariff.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tariff.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

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
              {filteredTariffs.map((tariff) => (
                <tr key={tariff.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pl-4">{tariff.id}</td>
                  <td className="py-3">{tariff.serviceName}</td>
                  <td className="py-3">{tariff.category}</td>
                  <td className="py-3">{formatCurrency(tariff.price)}</td>
                  <td className="py-3">
                    {tariff.description.length > 30
                      ? `${tariff.description.substring(0, 30)}...`
                      : tariff.description}
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
                      onClick={() => handleDelete(tariff.id)}
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
                    name="id"
                    value={currentTariff.id}
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
                    name="serviceName"
                    value={currentTariff.serviceName}
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
                    name="category"
                    value={currentTariff.category}
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
                    type="number"
                    name="price"
                    value={currentTariff.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={currentTariff.description}
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
