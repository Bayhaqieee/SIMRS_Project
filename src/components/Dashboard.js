import React, { useState, useEffect } from "react";
import {
  UserIcon,
  CalendarIcon,
  ActivityIcon,
  Users2Icon,
  TrendingUpIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react";

const Dashboard = ({ userRole }) => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayVisits: 0,
    activeEmergencies: 0,
    availableDoctors: 0,
  });

  // Simulate loading data
  useEffect(() => {
    // Simulating API call
    const timer = setTimeout(() => {
      setStats({
        totalPatients: 1245,
        todayVisits: 42,
        activeEmergencies: 8,
        availableDoctors: 15,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const recentPatients = [
    {
      id: "P001",
      name: "Ahmad Saputra",
      time: "10:30",
      status: "Menunggu Dokter",
      severity: "Sedang",
    },
    {
      id: "P002",
      name: "Siti Nurhayati",
      time: "10:45",
      status: "Dalam Perawatan",
      severity: "Kritis",
    },
    {
      id: "P003",
      name: "Budi Santoso",
      time: "11:00",
      status: "Selesai",
      severity: "Ringan",
    },
    {
      id: "P004",
      name: "Dewi Anggraini",
      time: "11:15",
      status: "Dalam Perawatan",
      severity: "Sedang",
    },
    {
      id: "P005",
      name: "Joko Widodo",
      time: "11:30",
      status: "Menunggu Dokter",
      severity: "Ringan",
    },
  ];

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "Kritis":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
            Kritis
          </span>
        );
      case "Sedang":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
            Sedang
          </span>
        );
      case "Ringan":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
            Ringan
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Menunggu Dokter":
        return <ClockIcon className="h-4 w-4 text-amber-500" />;
      case "Dalam Perawatan":
        return <AlertCircleIcon className="h-4 w-4 text-teal-500" />;
      case "Selesai":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <ActivityIcon className="h-7 w-7 text-teal-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard IGD</h2>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-teal-50 p-3 mr-4 border border-teal-100">
                <UserIcon className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Pasien</p>
                <h3 className="text-xl font-bold text-gray-800">{stats.totalPatients}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-50 p-3 mr-4 border border-blue-100">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Kunjungan Hari Ini</p>
                <h3 className="text-xl font-bold text-gray-800">{stats.todayVisits}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-red-50 p-3 mr-4 border border-red-100">
                <ActivityIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Kasus Aktif</p>
                <h3 className="text-xl font-bold text-gray-800">{stats.activeEmergencies}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-indigo-50 p-3 mr-4 border border-indigo-100">
                <Users2Icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Dokter Tersedia</p>
                <h3 className="text-xl font-bold text-gray-800">{stats.availableDoctors}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Patients */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-teal-600" />
                  Kunjungan Terbaru
                </h3>
                <button className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors flex items-center">
                  Lihat Semua
                  <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-3 py-3 bg-gray-50 rounded-l-lg">ID</th>
                      <th className="px-3 py-3 bg-gray-50">Nama Pasien</th>
                      <th className="px-3 py-3 bg-gray-50">Waktu</th>
                      <th className="px-3 py-3 bg-gray-50">Status</th>
                      <th className="px-3 py-3 bg-gray-50 rounded-r-lg">Kondisi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-4 text-sm font-medium text-gray-700">{patient.id}</td>
                        <td className="px-3 py-4 text-sm text-gray-700">{patient.name}</td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {patient.time}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-1.5 text-sm">
                            {getStatusIcon(patient.status)}
                            <span className="text-gray-700">{patient.status}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          {getSeverityBadge(patient.severity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                <TrendingUpIcon className="h-5 w-5 mr-2 text-teal-600" />
                Statistik Harian
              </h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Pasien Baru</span>
                    <span className="text-sm font-semibold text-teal-600">18</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-teal-500 h-2.5 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Kasus Darurat</span>
                    <span className="text-sm font-semibold text-red-600">8</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-red-500 h-2.5 rounded-full"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Pasien Keluar</span>
                    <span className="text-sm font-semibold text-green-600">12</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Rujukan</span>
                    <span className="text-sm font-semibold text-amber-600">4</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-amber-500 h-2.5 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Data diperbarui terakhir</span>
                  <span className="text-xs font-medium text-gray-700">10:15 WIB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;