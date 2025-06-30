// src/pages/AgentDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

function AgentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [parcels, setParcels] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await api.get("/parcels/assigned");
        setParcels(response.data);
      } catch (err) {
        console.error("Failed to fetch parcels:", err);
        setError("Failed to load assigned parcels.");
      }
    };

    fetchParcels();
  }, []);

  const handleStatusUpdate = async (parcelId, newStatus) => {
    try {
      await api.put(`/parcels/${parcelId}/status`, { status: newStatus });
      setParcels((prev) =>
        prev.map((p) => (p.id === parcelId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-white to-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-700">
          Agent Dashboard
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            🏠 Home
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Agent Info */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <p className="text-gray-700">
          <strong>Name:</strong> {user?.name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="text-gray-700">
          <strong>Role:</strong> {user?.role}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Assigned Parcels */}
      {parcels.length === 0 ? (
        <p className="text-gray-600 text-center">No assigned parcels yet.</p>
      ) : (
        <div className="grid gap-4">
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-white border border-purple-100 rounded-lg shadow-sm p-5"
            >
              <h2 className="text-lg font-semibold text-[#5c5470] mb-2">
                Parcel #{parcel.id}
              </h2>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Description:</strong> {parcel.description}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Destination:</strong> {parcel.destination}
              </p>
              <p className="text-sm font-medium text-indigo-600">
                <strong>Status:</strong> {parcel.status}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Picked", "In Transit", "Delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(parcel.id, status)}
                    disabled={parcel.status === status}
                    className={`px-4 py-1.5 text-sm rounded transition font-medium ${
                      parcel.status === status
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    Mark as {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentDashboard;
