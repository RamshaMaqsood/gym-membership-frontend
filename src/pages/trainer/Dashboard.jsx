import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("members");
  const [members, setMembers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  /* ================= FETCH DATA ================= */
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await api.get("/trainers/assigned-members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch members");
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const res = await api.get("/trainers/schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch schedules");
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchSchedules();
  }, []);

    const { logout } = useAuth();
  

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ================= UI ================= */
  return (
    <div className="p-8">
      {/* Header with logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "members"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("members")}
        >
          Assigned Members
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "schedules"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("schedules")}
        >
          Schedules
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "members" && (
        <div>
          {loadingMembers ? (
            <p>Loading members...</p>
          ) : members.length === 0 ? (
            <p>No members assigned.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Age</th>
                    <th className="border p-2 text-left">Membership</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m._id} className="hover:bg-gray-50">
                      <td className="border p-2">{m.name}</td>
                      <td className="border p-2">{m.email}</td>
                      <td className="border p-2">{m.age}</td>
                      <td className="border p-2">{m.membershipType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "schedules" && (
        <div>
          {loadingSchedules ? (
            <p>Loading schedules...</p>
          ) : schedules.length === 0 ? (
            <p>No schedules found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {schedules.map((s) => (
                <div
                  key={s._id}
                  className="border rounded-lg p-4 shadow-sm bg-white"
                >
                  <h2 className="text-lg font-semibold">{s.title}</h2>
                  <p>Date: {new Date(s.date).toLocaleDateString()}</p>
                  <p>Time: {s.time}</p>
                  <p>
                    Members:
                    <span className="ml-1">
                      {s.members.length > 0
                        ? s.members.map((m) => m.name).join(", ")
                        : " No members yet"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
