import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Calendar,
  FileText,
  BarChart2,
  Users,
  DollarSign,
} from "lucide-react";

export default function ManajemenLaporan() {
  const [reportType, setReportType] = useState("kunjungan");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: "kunjungan", name: "Laporan Kunjungan", icon: <Users size={18} /> },
    {
      id: "pendapatan",
      name: "Laporan Pendapatan",
      icon: <DollarSign size={18} />,
    },
    {
      id: "dokter",
      name: "Laporan Kinerja Dokter",
      icon: <FileText size={18} />,
    },
    {
      id: "obat",
      name: "Laporan Penggunaan Obat",
      icon: <BarChart2 size={18} />,
    },
  ];

  useEffect(() => {
    // Initialize with current date
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    setStartDate(formatDate(firstDayOfMonth));
    setEndDate(formatDate(today));

    // Load initial data
    generateReport();
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const generateReport = () => {
    setLoading(true);

    // Mock API call to fetch reports
    setTimeout(() => {
      const mockData = generateMockData();
      setReports(mockData);
      setLoading(false);
    }, 500);
  };

  const generateMockData = () => {
    // Generate different mock data based on report type
    switch (reportType) {
      case "kunjungan":
        return [
          {
            id: 1,
            date: "2025-05-01",
            patientCount: 32,
            emergencyCount: 5,
            generalCount: 22,
            specialistCount: 5,
          },
          {
            id: 2,
            date: "2025-05-02",
            patientCount: 28,
            emergencyCount: 3,
            generalCount: 19,
            specialistCount: 6,
          },
          {
            id: 3,
            date: "2025-05-03",
            patientCount: 25,
            emergencyCount: 2,
            generalCount: 17,
            specialistCount: 6,
          },
          {
            id: 4,
            date: "2025-05-04",
            patientCount: 35,
            emergencyCount: 7,
            generalCount: 20,
            specialistCount: 8,
          },
        ];
      case "pendapatan":
        return [
          {
            id: 1,
            date: "2025-05-01",
            totalRevenue: 6540000,
            consultationRevenue: 3250000,
            medicineRevenue: 2100000,
            procedureRevenue: 1190000,
          },
          {
            id: 2,
            date: "2025-05-02",
            totalRevenue: 5870000,
            consultationRevenue: 2800000,
            medicineRevenue: 1950000,
            procedureRevenue: 1120000,
          },
          {
            id: 3,
            date: "2025-05-03",
            totalRevenue: 5320000,
            consultationRevenue: 2500000,
            medicineRevenue: 1720000,
            procedureRevenue: 1100000,
          },
          {
            id: 4,
            date: "2025-05-04",
            totalRevenue: 7120000,
            consultationRevenue: 3500000,
            medicineRevenue: 2310000,
            procedureRevenue: 1310000,
          },
        ];
      case "dokter":
        return [
          {
            id: 1,
            doctorName: "dr. Andi Wijaya",
            specialization: "Umum",
            patientCount: 48,
            rating: 4.8,
          },
          {
            id: 2,
            doctorName: "dr. Diana Putri",
            specialization: "Anak",
            patientCount: 35,
            rating: 4.7,
          },
          {
            id: 3,
            doctorName: "dr. Budi Prakoso",
            specialization: "Bedah",
            patientCount: 22,
            rating: 4.9,
          },
          {
            id: 4,
            doctorName: "dr. Sinta Dewi",
            specialization: "Penyakit Dalam",
            patientCount: 31,
            rating: 4.6,
          },
        ];
      case "obat":
        return [
          {
            id: 1,
            medicineName: "Paracetamol 500mg",
            quantity: 248,
            revenue: 1240000,
            category: "Analgesik",
          },
          {
            id: 2,
            medicineName: "Amoxicillin 500mg",
            quantity: 162,
            revenue: 1782000,
            category: "Antibiotik",
          },
          {
            id: 3,
            medicineName: "Omeprazole 20mg",
            quantity: 96,
            revenue: 1152000,
            category: "Antasida",
          },
          {
            id: 4,
            medicineName: "Cetirizine 10mg",
            quantity: 118,
            revenue: 826000,
            category: "Antihistamin",
          },
        ];
      default:
        return [];
    }
  };

  const handleTypeChange = (type) => {
    setReportType(type);
    generateReport();
  };

  const handleExport = () => {
    alert("Laporan berhasil diunduh!");
  };

  const filteredReports = reports.filter((report) => {
    if (reportType === "dokter") {
      return report.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (reportType === "obat") {
      return report.medicineName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Manajemen Laporan</h1>
        <p className="text-gray-600">
          Lihat dan hasilkan laporan detail untuk pengambilan keputusan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {reportTypes.map((type) => (
          <div
            key={type.id}
            className={`p-4 rounded-lg border cursor-pointer ${
              reportType === type.id
                ? "bg-blue-50 border-blue-500"
                : "bg-white border-gray-200"
            }`}
            onClick={() => handleTypeChange(type.id)}
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full mr-3 ${
                  reportType === type.id
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {type.icon}
              </div>
              <span
                className={`font-medium ${
                  reportType === type.id ? "text-blue-800" : "text-gray-700"
                }`}
              >
                {type.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Calendar className="text-gray-400 mr-2" size={18} />
            <span className="text-gray-700 mr-2">Periode:</span>
            <input
              type="date"
              className="border rounded px-2 py-1 mr-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="mx-2">-</span>
            <input
              type="date"
              className="border rounded px-2 py-1 mr-4"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              onClick={generateReport}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Tampilkan
            </button>
          </div>

          {(reportType === "dokter" || reportType === "obat") && (
            <div className="relative w-64">
              <input
                type="text"
                placeholder={`Cari ${
                  reportType === "dokter" ? "dokter" : "obat"
                }...`}
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : (
          <>
            {reportType === "kunjungan" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Pasien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Umum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spesialis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Darurat
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.patientCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.generalCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.specialistCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.emergencyCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === "pendapatan" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Pendapatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Konsultasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Obat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(report.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(report.consultationRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(report.medicineRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(report.procedureRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === "dokter" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Dokter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spesialisasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Pasien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.doctorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.patientCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{report.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === "obat" && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Obat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Digunakan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pendapatan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.medicineName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(report.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <Download className="mr-2" size={18} />
            Export Laporan
          </button>
        </div>
      </div>
    </div>
  );
}
