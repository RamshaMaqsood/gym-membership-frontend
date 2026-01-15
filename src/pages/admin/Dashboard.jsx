import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/manager/Navbar";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    members: 0,
    trainers: 0,
    schedules: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total members
        const dashboardStatsRes = await api.get("/reports/dashboard");

        setStats({
          members: dashboardStatsRes.data.totalMembers,
          trainers: dashboardStatsRes.data.totalTrainers,
          schedules: dashboardStatsRes.data.todaySchedules,
        });
      } catch (error) {
        console.error(error);
        alert("Failed to fetch dashboard stats");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {user?.role}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Members</p>
            <p className="text-2xl font-bold">{stats.members}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Trainers</p>
            <p className="text-2xl font-bold">{stats.trainers}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Today's Sessions</p>
            <p className="text-2xl font-bold">{stats.schedules}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
