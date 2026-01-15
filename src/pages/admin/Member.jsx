import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/manager/Navbar";

const API_URL = "http://localhost:3000"; // adjust if needed

export default function Member() {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    membershipType: "",
    contactInfo: "",
  });

  // add this state
  const [trainers, setTrainers] = useState([]);


  const token = localStorage.getItem("token");

  /* ---------------- FETCH MEMBERS ---------------- */
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch members");
    }
  };

  const fetchTrainers = async () => {
  try {
    const res = await axios.get(`${API_URL}/trainers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // ensure the backend returns trainer objects for the manager's gym
    setTrainers(res.data || []);
  } catch (err) {
    console.error("Failed to fetch trainers", err);
    setTrainers([]);
  }
};

  useEffect(() => {
    fetchMembers();
    fetchTrainers();
  }, []);

  /* ---------------- OPEN ADD MODAL ---------------- */
  const openAddModal = () => {
    setEditingMember(null);
    setForm({
      name: "",
      age: "",
      email: "",
      password: "",
      membershipType: "",
      contactInfo: "",
    });
    setShowModal(true);
  };

  /* ---------------- OPEN EDIT MODAL ---------------- */
  const openEditModal = (member) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      age: member.age,
      email: member.email,
      password: "",
      membershipType: member.membershipType,
      contactInfo: member.contactInfo,
    });
    setShowModal(true);
  };

  /* ---------------- SUBMIT FORM ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingMember) {
        const { password, ...updateData } = form;

        await axios.put(`${API_URL}/members/${editingMember._id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Member updated successfully");
      } else {
        await axios.post(`${API_URL}/members/create`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Member added successfully");
      }

      setShowModal(false);
      setEditingMember(null);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  /* ---------------- DELETE MEMBER ---------------- */
  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await axios.delete(`${API_URL}/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete member");
    }
  };

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [memberToAssign, setMemberToAssign] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState("");

  const openAssignModal = (member) => {
    setMemberToAssign(member);
    setSelectedTrainer(member.trainer?._id || "");
    setShowAssignModal(true);
  };

  const handleAssignTrainer = async () => {
    if (!selectedTrainer || !memberToAssign) return;

    try {
      await axios.put(
        `${API_URL}/members/${memberToAssign._id}/assign-trainer`,
        { trainerId: selectedTrainer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Trainer assigned successfully");
      setShowAssignModal(false);
      setMemberToAssign(null);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to assign trainer");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Members</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Member
          </button>
        </div>

        {/* ---------------- TABLE ---------------- */}
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Membership</th>
                <th className="border p-2">Trainer</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id} className="text-center">
                  <td className="border p-2">{m.name}</td>
                  <td className="border p-2">{m.email}</td>
                  <td className="border p-2">{m.age}</td>
                  <td className="border p-2">{m.membershipType}</td>
                  <td className="border p-2">
                    {m.trainer ? m.trainer.name : "Not assigned"}
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => openEditModal(m)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMember(m._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openAssignModal(m)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Assign Trainer
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---------------- MODAL ---------------- */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded p-6 relative">
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-xl"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-4">
                {editingMember ? "Edit Member" : "Add Member"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="border rounded px-3 py-2 w-full"
                />

                <input
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  required
                  className="border rounded px-3 py-2 w-full"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="border rounded px-3 py-2 w-full"
                />

                {!editingMember && (
                  <>
                    <input
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                      className="border rounded px-3 py-2 w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Password will be used for member login
                    </p>
                  </>
                )}

                <input
                  type="text"
                  placeholder="Membership Type"
                  value={form.membershipType}
                  onChange={(e) =>
                    setForm({ ...form, membershipType: e.target.value })
                  }
                  required
                  className="border rounded px-3 py-2 w-full"
                />

                <input
                  type="text"
                  placeholder="Contact Info"
                  value={form.contactInfo}
                  onChange={(e) =>
                    setForm({ ...form, contactInfo: e.target.value })
                  }
                  required
                  className="border rounded px-3 py-2 w-full"
                />

                <button
                  type="submit"
                  className="bg-blue-600 text-white w-full py-2 rounded"
                >
                  {editingMember ? "Update Member" : "Add Member"}
                </button>
              </form>
            </div>
          </div>
        )}

        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded p-6 relative">
              <button
                onClick={() => setShowAssignModal(false)}
                className="absolute top-2 right-3 text-xl"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-4">
                Assign Trainer to {memberToAssign.name}
              </h2>

              <select
                className="border rounded px-3 py-2 w-full mb-4"
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
              >
                <option value="">-- Select Trainer --</option>
                {trainers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssignTrainer}
                className="bg-green-600 text-white w-full py-2 rounded"
              >
                Assign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
