// src/pages/ParcelDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ParcelDetails() {
  const { id } = useParams();
  const [parcel, setParcel] = useState(null);

  useEffect(() => {
    // TODO: Replace this with API call: axios.get(`/api/parcels/${id}`)
    const dummyData = {
      id,
      description: "Gift package to Eldoret",
      destination: "Eldoret",
      status: "Delivered",
      created_at: "2025-06-18",
      updated_at: "2025-06-22",
      tracking: [
        { status: "Created", date: "2025-06-18" },
        { status: "In Transit", date: "2025-06-20" },
        { status: "Delivered", date: "2025-06-22" },
      ],
    };
    setParcel(dummyData);
  }, [id]);

  if (!parcel) {
    return <div className="p-6">Loading parcel details...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Parcel #{parcel.id}</h1>
      <p className="text-gray-600 mb-4">{parcel.description}</p>

      <div className="bg-white shadow-sm border rounded p-4 mb-6">
        <p>
          <strong>Status:</strong> {parcel.status}
        </p>
        <p>
          <strong>Destination:</strong> {parcel.destination}
        </p>
        <p>
          <strong>Created At:</strong> {parcel.created_at}
        </p>
        <p>
          <strong>Last Updated:</strong> {parcel.updated_at}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Tracking History</h2>
      <ul className="bg-white border rounded shadow-sm divide-y">
        {parcel.tracking.map((entry, index) => (
          <li key={index} className="px-4 py-2 flex justify-between">
            <span>{entry.status}</span>
            <span className="text-gray-500 text-sm">{entry.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParcelDetails;
