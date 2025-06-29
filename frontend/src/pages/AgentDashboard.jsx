// src/pages/AgentDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function AgentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [parcels, setParcels] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await api.get("/agent/deliveries");
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">
          Welcome Agent {user?.name || ""}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {parcels.length === 0 ? (
        <p className="text-gray-600">No assigned parcels.</p>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-white p-4 rounded shadow border border-gray-200"
            >
              <h2 className="font-semibold text-lg text-gray-800">
                Parcel #{parcel.id}
              </h2>
              <p className="text-sm text-gray-600">
                <strong>Description:</strong> {parcel.description}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Destination:</strong> {parcel.destination}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>{" "}
                <span className="font-medium text-indigo-700">
                  {parcel.status}
                </span>
              </p>

              <div className="mt-3 flex gap-2 flex-wrap">
                {["Picked", "In Transit", "Delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(parcel.id, status)}
                    disabled={parcel.status === status}
                    className={`px-3 py-1 rounded text-sm transition ${
                      parcel.status === status
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                    }`}
                  >
                    {status}
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
