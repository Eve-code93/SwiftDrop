import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ParcelDetails from "./pages/ParcelDetails";
import CreateParcel from "./pages/CreateParcel";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password/:token" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={["sender"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/agent"
        element={
          <PrivateRoute allowedRoles={["agent"]}>
            <AgentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/parcels/:id"
        element={
          <PrivateRoute allowedRoles={["user", "admin", "agent"]}>
            <ParcelDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/parcels/new"
        element={
          <PrivateRoute allowedRoles={["user"]}>
            <CreateParcel />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={["user", "admin", "agent"]}>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}
export default App;   