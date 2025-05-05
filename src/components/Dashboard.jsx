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
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Kritis
          </span>
        );
      case "Sedang":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Sedang
          </span>
        );
      case "Ringan":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
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
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case "Dalam Perawatan":
        return <AlertCircleIcon className="h-4 w-4 text-blue-500" />;
      case "Selesai":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pasien</p>
              <h3 className="text-xl font-bold">{stats.totalPatients}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kunjungan Hari Ini</p>
              <h3 className="text-xl font-bold">{stats.todayVisits}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <ActivityIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kasus Aktif</p>
              <h3 className="text-xl font-bold">{stats.activeEmergencies}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Users2Icon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dokter Tersedia</p>
              <h3 className="text-xl font-bold">{stats.availableDoctors}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Kunjungan Terbaru</h3>
              <button className="text-blue-600 text-sm">Lihat Semua</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Nama Pasien</th>
                    <th className="pb-3">Waktu</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Kondisi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="border-t">
                      <td className="py-3">{patient.id}</td>
                      <td className="py-3">{patient.name}</td>
                      <td className="py-3">{patient.time}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(patient.status)}
                          <span>{patient.status}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {getSeverityBadge(patient.severity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Statistik Harian</h3>
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Pasien Baru</span>
                <span className="text-sm font-semibold">18</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Kasus Darurat</span>
                <span className="text-sm font-semibold">8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Pasien Keluar</span>
                <span className="text-sm font-semibold">12</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Rujukan</span>
                <span className="text-sm font-semibold">4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: "20%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
