import { useEffect, useState } from "react";

function UserDashboard() {
  const [parcels, setParcels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newParcel, setNewParcel] = useState({
    description: "",
    destination: "",
  });

  useEffect(() => {
    // TODO: Fetch user parcels from backend using user ID or token
    const dummyParcels = [
      {
        id: 1,
        description: "Documents to Nairobi",
        status: "In Transit",
        created_at: "2025-06-23",
      },
      {
        id: 2,
        description: "Gift package to Eldoret",
        status: "Delivered",
        created_at: "2025-06-18",
      },
    ];
    setParcels(dummyParcels);
  }, []);

  const handleCreateParcel = (e) => {
    e.preventDefault();
    if (!newParcel.description || !newParcel.destination) return;

    // TODO: Send POST request to backend to create parcel
    // Example: axios.post('/api/parcels', newParcel)

    const fakeNew = {
      id: Date.now(),
      ...newParcel,
      status: "Pending",
      created_at: new Date().toISOString().split("T")[0],
    };
    setParcels([fakeNew, ...parcels]);
    setNewParcel({ description: "", destination: "" });
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Parcels</h1>

      {/* Toggle New Parcel Form */}
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "+ Create New Parcel"}
      </button>

      {/* New Parcel Form */}
      {showForm && (
        <form
          onSubmit={handleCreateParcel}
          className="bg-white border p-4 rounded mb-6 shadow-sm"
        >
          <input
            type="text"
            placeholder="Parcel Description"
            value={newParcel.description}
            onChange={(e) =>
              setNewParcel({ ...newParcel, description: e.target.value })
            }
            className="block w-full border rounded px-3 py-2 mb-3"
          />
          <input
            type="text"
            placeholder="Destination"
            value={newParcel.destination}
            onChange={(e) =>
              setNewParcel({ ...newParcel, destination: e.target.value })
            }
            className="block w-full border rounded px-3 py-2 mb-3"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      )}

      {/* List of Parcels */}
      <div className="space-y-4">
        {parcels.map((parcel) => (
          <div
            key={parcel.id}
            className="border p-4 rounded shadow-sm bg-white"
          >
            <h2 className="text-lg font-semibold">{parcel.description}</h2>
            <p>Destination: {parcel.destination || "N/A"}</p>
            <p>Status: {parcel.status}</p>
            <p className="text-sm text-gray-500">
              Created: {parcel.created_at}
            </p>
            <button className="mt-2 text-blue-600 underline">
              Track Parcel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;
