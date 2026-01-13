import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== role) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Manager Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="manager">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Other dashboards */}
      <Route
        path="/trainer/dashboard"
        element={
          <ProtectedRoute role="trainer">
            {/* TrainerDashboard */}
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/dashboard"
        element={
          <ProtectedRoute role="member">
            {/* MemberDashboard */}
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
