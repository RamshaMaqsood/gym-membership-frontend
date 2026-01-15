import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // axios instance pointing to your backend
import { useAuth } from "../../context/AuthContext";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingTrainer, setLoadingTrainer] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const { logout } = useAuth();

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ---------------- FETCH DATA ---------------- */
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await api.get("/members/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchTrainer = async () => {
    setLoadingTrainer(true);
    try {
      const res = await api.get("/members/assigned-trainer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainer(res.data);
    } catch (err) {
      console.error(err);
      setTrainer(null);
    } finally {
      setLoadingTrainer(false);
    }
  };

  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const res = await api.get("/members/schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTrainer();
    fetchSchedules();
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Member Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "profile"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "trainer"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("trainer")}
        >
          Assigned Trainer
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
      {activeTab === "profile" && (
        <div className="bg-white p-6 rounded shadow">
          {loadingProfile ? (
            <p>Loading profile...</p>
          ) : profile ? (
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {profile.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {profile.email}
              </p>
              <p>
                <span className="font-medium">Age:</span> {profile.age}
              </p>
              <p>
                <span className="font-medium">Membership:</span>{" "}
                {profile.membershipType}
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {profile.contactInfo}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No profile found.</p>
          )}
        </div>
      )}

      {activeTab === "trainer" && (
        <div className="bg-white p-6 rounded shadow">
          {loadingTrainer ? (
            <p>Loading trainer...</p>
          ) : trainer ? (
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {trainer.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {trainer.email}
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {trainer.contactInfo || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No trainer assigned.</p>
          )}
        </div>
      )}

      {activeTab === "schedules" && (
        <div className="grid gap-4 md:grid-cols-2">
          {loadingSchedules ? (
            <p>Loading schedules...</p>
          ) : schedules.length === 0 ? (
            <p className="text-gray-500">No schedules found.</p>
          ) : (
            schedules.map((s) => (
              <div
                key={s._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p>Date: {new Date(s.date).toLocaleDateString()}</p>
                <p>Time: {s.time}</p>
                <p>
                  Trainer:{" "}
                  <span className="font-medium">{s.trainer?.name}</span>
                </p>
                <p>
                  Members:{" "}
                  {s.members.length > 0
                    ? s.members.map((m) => m.name).join(", ")
                    : "No other members"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
