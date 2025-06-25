// src/pages/CreateParcel.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateParcel() {
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description || !destination) {
      setError("Please fill in all fields");
      return;
    }

    setError("");

    // TODO: Send POST request to backend to create parcel
    // axios.post('/api/parcels', { description, destination, ... })

    // For now, simulate success and redirect
    console.log("Parcel created:", { description, destination });
    navigate("/dashboard"); // Go back to dashboard after creation
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">
          Create Parcel
        </h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Documents to Nairobi"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-400"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-700">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Nairobi"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateParcel;
