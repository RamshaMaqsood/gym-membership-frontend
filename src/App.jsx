import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import { useAuth } from "./context/AuthContext";
import Member from "./pages/admin/Member";
import Trainer from "./pages/admin/Trainer";
import Schedule from "./pages/admin/Schedule";
import TrainerDashboard from "./pages/trainer/Dashboard";
import MemberDashboard from "./pages/member/Dashboard";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== role) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return ( 
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Admin/Manager Routes  */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="manager">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/members"
        element={
          <ProtectedRoute role="manager">
            <Member/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/trainers"
        element={
          <ProtectedRoute role="manager">
            <Trainer/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/schedules"
        element={
          <ProtectedRoute role="manager">
            <Schedule/>
          </ProtectedRoute>
        }
      />

      {/* Trainer Routes  */}
      <Route
        path="/trainer/dashboard"
        element={
          <ProtectedRoute role="trainer">
            <TrainerDashboard/>
          </ProtectedRoute>
        }
      />

      {/* Trainer Routes  */}
      <Route
        path="/member/dashboard"
        element={
          <ProtectedRoute role="member">
            <MemberDashboard/>
          </ProtectedRoute>
        }
      />



      {/* Fallback */}
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  );
}

export default App;
