// src/pages/AgentDashboard.jsx
import { useEffect, useState } from "react";

function AgentDashboard() {
  const [parcels, setParcels] = useState([]);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    // TODO: Fetch parcels assigned to this agent from backend
    // Example: axios.get('/api/agent/parcels')
    const dummyParcels = [
      {
        id: 101,
        description: "Electronics to Kisumu",
        status: "In Transit",
        recipient: "Kevin",
      },
      {
        id: 102,
        description: "Medicine to Mombasa",
        status: "Pending Pickup",
        recipient: "Sarah",
      },
    ];
    setParcels(dummyParcels);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setStatuses((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleUpdate = (parcelId) => {
    const newStatus = statuses[parcelId];
    if (!newStatus) return;

    // TODO: Send status update to backend
    // axios.put(`/api/parcels/${parcelId}/status`, { status: newStatus })

    console.log(`Updated parcel ${parcelId} to status: ${newStatus}`);
    // Simulate local update
    setParcels((prev) =>
      prev.map((p) => (p.id === parcelId ? { ...p, status: newStatus } : p))
    );
    setStatuses((prev) => ({ ...prev, [parcelId]: "" }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assigned Parcels</h1>

      {parcels.length === 0 ? (
        <p>No parcels assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{parcel.description}</h2>
              <p className="text-sm text-gray-600">
                Recipient: {parcel.recipient}
              </p>
              <p className="mb-2 text-sm">
                Current Status: <strong>{parcel.status}</strong>
              </p>

              <div className="flex items-center space-x-2">
                <select
                  value={statuses[parcel.id] || ""}
                  onChange={(e) =>
                    handleStatusChange(parcel.id, e.target.value)
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="">Select Status</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed Delivery">Failed Delivery</option>
                </select>
                <button
                  onClick={() => handleUpdate(parcel.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentDashboard;
