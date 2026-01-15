import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/manager/Navbar";

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    contactInfo: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  /* ================= FETCH TRAINERS ================= */
  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trainers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTrainer) {
        // Never send password on edit unless explicitly implemented
        const payload = {
          name: form.name,
          age: form.age,
          email: form.email,
          contactInfo: form.contactInfo,
        };

        await api.put(`/trainers/${editingTrainer._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Trainer updated successfully");
      } else {
        await api.post("/trainers/create", form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Trainer added successfully");
      }

      closeModal();
      fetchTrainers();
    } catch (err) {
      console.error(err);
      alert("Failed to save trainer");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trainer?"))
      return;

    try {
      await api.delete(`/trainers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete trainer");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setForm({
      name: trainer.name,
      age: trainer.age,
      email: trainer.email,
      contactInfo: trainer.contactInfo,
      password: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTrainer(null);
    setForm({
      name: "",
      age: "",
      email: "",
      contactInfo: "",
      password: "",
    });
  };

  const filteredTrainers = trainers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Loading trainers...</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Navbar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trainers</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Trainer
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 mb-4 w-full md:w-1/3"
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Age</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTrainers.map((trainer) => (
                <tr key={trainer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{trainer.name}</td>
                  <td className="px-6 py-3">{trainer.age}</td>
                  <td className="px-6 py-3">{trainer.email}</td>
                  <td className="px-6 py-3">{trainer.contactInfo}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(trainer)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trainer._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTrainers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No trainers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-xl font-bold text-gray-500"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold mb-4">
                {editingTrainer ? "Edit Trainer" : "Add Trainer"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="border px-3 py-2 w-full rounded"
                />

                <input
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  required
                  className="border px-3 py-2 w-full rounded"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="border px-3 py-2 w-full rounded"
                />

                <input
                  type="text"
                  placeholder="Contact Info"
                  value={form.contactInfo}
                  onChange={(e) =>
                    setForm({ ...form, contactInfo: e.target.value })
                  }
                  className="border px-3 py-2 w-full rounded"
                />

                {!editingTrainer && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    className="border px-3 py-2 w-full rounded"
                  />
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    {editingTrainer ? "Update" : "Add"}
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

export default Trainers;
