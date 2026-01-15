import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/manager/Navbar";

const Schedules = () => {
  const token = localStorage.getItem("token");

  const [schedules, setSchedules] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");

  const [filterDate, setFilterDate] = useState("");

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    trainerId: "",
  });

  /* ================= FETCH DATA ================= */

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const url = filterDate ? `/schedules?date=${filterDate}` : "/schedules";
      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    const res = await api.get("/trainers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTrainers(res.data);
  };

  const fetchMembers = async () => {
    const res = await api.get("/members", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMembers(res.data);
  };

  useEffect(() => {
    fetchSchedules();
    fetchTrainers();
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [filterDate]);

  /* ================= CREATE SCHEDULE ================= */

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post("/schedules/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Schedule created");
      closeModal();
      fetchSchedules();
    } catch (err) {
      console.error(err);
      alert("Failed to create schedule");
    }
  };

  /* ================= ADD MEMBER ================= */

  const addMemberToSchedule = async () => {
    if (!selectedMember) return;

    try {
      await api.put(
        `/schedules/${selectedSchedule._id}/add-member`,
        { memberId: selectedMember },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Member added");
      setSelectedMember("");
      setSelectedSchedule(null);
      fetchSchedules();
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    }
  };

  /* ================= DELETE SCHEDULE ================= */

  const handleDeleteSchedule = async (scheduleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this schedule?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/schedules/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Schedule deleted successfully");
      fetchSchedules();
    } catch (err) {
      console.error(err);
      alert("Failed to delete schedule");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ title: "", date: "", time: "", trainerId: "" });
  };

  if (loading) return <p className="p-6">Loading schedules...</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Navbar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Schedules</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Schedule
          </button>
        </div>

        {/* Filter by date */}
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-3 py-2 rounded mb-4"
        />

        {/* Schedule Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{schedule.title}</h2>
              <p>Date: {new Date(schedule.date).toLocaleDateString()}</p>
              <p>Time: {schedule.time}</p>
              <p>
                Trainer:{" "}
                <span className="font-medium">{schedule.trainer?.name}</span>
              </p>

              <div className="mt-2">
                <p className="font-medium">Members:</p>
                <ul className="list-disc ml-5">
                  {schedule.members.map((m) => (
                    <li key={m._id}>{m.name}</li>
                  ))}
                  {schedule.members.length === 0 && (
                    <li className="text-gray-500">No members yet</li>
                  )}
                </ul>
              </div>

              {/* Add Member */}
              <div className="mt-3 flex gap-2">
                <select
                  className="border px-2 py-1 rounded flex-1"
                  value={
                    selectedSchedule?._id === schedule._id ? selectedMember : ""
                  }
                  onChange={(e) => {
                    setSelectedSchedule(schedule);
                    setSelectedMember(e.target.value);
                  }}
                >
                  <option value="">Select member</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={addMemberToSchedule}
                  className="bg-green-600 text-white px-3 rounded"
                >
                  Add
                </button>
              </div>
              <div className="mt-4 flex justify-start">
                <button
                  onClick={() => handleDeleteSchedule(schedule._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Delete Schedule
                </button>
              </div>
            </div>
          ))}

          {schedules.length === 0 && (
            <p className="text-gray-500">No schedules found</p>
          )}
        </div>

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-xl font-bold"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-4">Create Schedule</h2>

              <form onSubmit={handleCreate} className="space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="border px-3 py-2 w-full rounded"
                />

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="border px-3 py-2 w-full rounded"
                />

                <input
                  type="text"
                  placeholder="Time (e.g. 07:00 - 08:00)"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                  className="border px-3 py-2 w-full rounded"
                />

                <select
                  value={form.trainerId}
                  onChange={(e) =>
                    setForm({ ...form, trainerId: e.target.value })
                  }
                  required
                  className="border px-3 py-2 w-full rounded"
                >
                  <option value="">Select Trainer</option>
                  {trainers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedules;
