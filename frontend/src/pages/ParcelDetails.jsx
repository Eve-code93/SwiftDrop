// src/pages/ParcelDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

function ParcelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const response = await axios.get(`/parcels/${id}`);
        setParcel(response.data);
      } catch (err) {
        setError("Parcel not found or you are not authorized to view it.");
        console.error(err);
      }
    };

    fetchParcel();
  }, [id]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!parcel) return <div className="p-6">Loading parcel details...</div>;

  return (
    <div className="p-6">
      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 text-indigo-600 text-sm hover:underline"
      >
        ← Back to Dashboard
      </button>

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

      {parcel.tracking?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Tracking History</h2>
          <ul className="bg-white border rounded shadow-sm divide-y">
            {parcel.tracking.map((entry, index) => (
              <li key={index} className="px-4 py-2 flex justify-between">
                <span>{entry.status}</span>
                <span className="text-gray-500 text-sm">{entry.date}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ParcelDetails;
