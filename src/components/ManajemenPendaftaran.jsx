import React, { useState, useEffect } from "react";
import { Search, PlusCircle, Edit2, Trash2, Eye } from "lucide-react";
import supabase from "../supabaseClient";

export default function ManajemenPendaftaran() {
  const [pendaftaran, setPendaftaran] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [formData, setFormData] = useState({
    id_pasien: "",
    nama_pasien: "",
    tanggal: "",
    dokter: "",
    jeniskunjungan: "",
    status: "Menunggu",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPendaftaran();
  }, []);

  const fetchPendaftaran = async () => {
    const { data, error } = await supabase
      .from("pendaftaran")
      .select("*")
      .order("tanggal", { ascending: false });

    if (!error) setPendaftaran(data);
  };

  const generatePatientId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return parseInt(`${year}${month}${day}${randomNum}`, 10);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    if (!formData.nama_pasien) {
      alert("Silakan isi nama pasien terlebih dahulu.");
      return;
    }

    // Generate ID pasien jika data baru
    const submissionData = {
      ...formData,
      id_pasien: formData.id_pasien || generatePatientId(),
      tanggal: formData.tanggal || new Date().toISOString().split('T')[0]
    };

    try {
      if (formData.id_pasien) {
        const { error } = await supabase
          .from("pendaftaran")
          .update(submissionData)
          .eq("id_pasien", formData.id_pasien);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("pendaftaran")
          .insert([submissionData]);

        if (error) throw error;
      }

      resetForm();
      setIsModalOpen(false);
      fetchPendaftaran();
    } catch (error) {
      alert(`Gagal menyimpan data: ${error.message}`);
    }
  };

  const editData = (data) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  const viewData = (data) => {
    setCurrentData(data);
    setIsViewModalOpen(true);
  };

  const deleteData = async (id_pasien) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pendaftaran ini?")) {
      const { error } = await supabase.from("pendaftaran").delete().eq("id_pasien", id_pasien);
      if (!error) fetchPendaftaran();
    }
  };

  const resetForm = () => {
    setFormData({
      id_pasien: "",
      nama_pasien: "",
      tanggal: "",
      dokter: "",
      jeniskunjungan: "",
      status: "Menunggu",
    });
  };

  const filteredData = pendaftaran.filter(
    (item) =>
      item.nama_pasien?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id_pasien?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dokter?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Manajemen Pendaftaran</h1>
        <p className="text-gray-600">Kelola pendaftaran pasien untuk kunjungan medis</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Cari pendaftaran..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full font-normal"
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
              <th className="px-6 py-3 text-left">ID Pasien</th>
              <th className="px-6 py-3 text-left">Nama Pasien</th>
              <th className="px-6 py-3 text-left">Tanggal</th>
              <th className="px-6 py-3 text-left">Dokter</th>
              <th className="px-6 py-3 text-left">Jenis Kunjungan</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id_pasien}>
                <td className="px-6 py-4">{item.id_pasien}</td>
                <td className="px-6 py-4">{item.nama_pasien}</td>
                <td className="px-6 py-4">{item.tanggal}</td>
                <td className="px-6 py-4">{item.dokter}</td>
                <td className="px-6 py-4">{item.jeniskunjungan}</td>
                <td className="px-6 py-4">{item.status}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => viewData(item)} className="text-indigo-600">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => editData(item)} className="text-yellow-600">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteData(item.id_pasien)} className="text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {formData.id_pasien ? "Edit Pendaftaran" : "Tambah Pendaftaran"}
            </h2>
            <form onSubmit={handleSubmit}>
              {formData.id_pasien && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    ID Pasien
                  </label>
                  <input
                    type="text"
                    value={`P-${formData.id_pasien}`}
                    className="w-full border px-3 py-2 rounded bg-gray-100 font-normal"
                    readOnly
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Pasien
                </label>
                <input
                  type="text"
                  name="nama_pasien"
                  value={formData.nama_pasien}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded font-normal"
                  required
                  placeholder="Masukkan Nama Pasien"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded font-normal"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Dokter
                </label>
                <input
                  type="text"
                  name="dokter"
                  value={formData.dokter}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded font-normal"
                  required
                  placeholder="Masukkan Nama Dokter"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Jenis Kunjungan
                </label>
                <select
                  name="jeniskunjungan"
                  value={formData.jeniskunjungan}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded font-normal"
                  required
                >
                  <option value="">Pilih</option>
                  <option value="Umum">Umum</option>
                  <option value="Spesialis">Spesialis</option>
                  <option value="Darurat">Darurat</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded font-normal"
                  required
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded font-normal"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded font-normal"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View */}
      {isViewModalOpen && currentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Detail Pendaftaran</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["ID Pasien", currentData.id_pasien],
                ["Nama Pasien", currentData.nama_pasien],
                ["Tanggal", currentData.tanggal],
                ["Dokter", currentData.dokter],
                ["Jenis Kunjungan", currentData.jeniskunjungan],
                ["Status", currentData.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded font-normal"
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