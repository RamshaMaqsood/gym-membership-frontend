import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';



const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
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
    </>
  )
}

export default Navbar
