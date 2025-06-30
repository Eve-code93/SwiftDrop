// src/pages/ParcelDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios"; // Uncomment when using real API

function ParcelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        // Replace this with your actual API call
        // const response = await api.get(`/parcels/${id}`);
        // setParcel(response.data);

        // Dummy data for testing
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
      } catch (error) {
        console.error("Failed to fetch parcel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParcel();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading parcel details...</div>;
  }

  if (!parcel) {
    return (
      <div className="p-6 text-red-600">
        Unable to load parcel details. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 text-sm mb-4 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Parcel #{parcel.id}
        </h1>
        <p className="text-sm text-gray-500 mb-4">{parcel.description}</p>

        <div className="bg-white border rounded-lg shadow-sm p-5 mb-6 space-y-2">
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-indigo-700 font-medium">{parcel.status}</span>
          </p>
          <p>
            <strong>Destination:</strong> {parcel.destination}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            <span className="text-gray-600">{parcel.created_at}</span>
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            <span className="text-gray-600">{parcel.updated_at}</span>
          </p>
        </div>

        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          Tracking History
        </h2>
        <ul className="bg-white border rounded-lg shadow-sm divide-y">
          {parcel.tracking.map((entry, index) => (
            <li
              key={index}
              className="px-4 py-2 flex justify-between text-sm text-gray-700"
            >
              <span>{entry.status}</span>
              <span className="text-gray-500">{entry.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ParcelDetails;
