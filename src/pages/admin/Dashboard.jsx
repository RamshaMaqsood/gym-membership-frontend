import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    members: 0,
    trainers: 0,
    schedules: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

         // Total members
        const dashboardStatsRes = await api.get("/report/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Manager Panel</h2>
        <nav className="flex flex-col gap-4">
          <button
            className="text-left text-gray-700 hover:text-blue-600"
            onClick={() => navigate("/admin/dashboard")}
          >
            Dashboard
          </button>
          <button
            className="text-left text-gray-700 hover:text-blue-600"
            onClick={() => navigate("/admin/members")}
          >
            Members
          </button>
          <button
            className="text-left text-gray-700 hover:text-blue-600"
            onClick={() => navigate("/admin/trainers")}
          >
            Trainers
          </button>
          <button
            className="text-left text-gray-700 hover:text-blue-600"
            onClick={() => navigate("/admin/schedules")}
          >
            Schedules
          </button>
          <button
            className="text-left text-red-600 hover:text-red-700 mt-10"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>

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
