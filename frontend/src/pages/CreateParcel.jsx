import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

function CreateParcel() {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!description || !destination) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await api.post("/parcels", {
        description,
        destination,
        sender_id: user.id,
      });

      setSuccess("Parcel created successfully!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Failed to create parcel:", err);
      setError("Failed to create parcel. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">
          Create Parcel
        </h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

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

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-indigo-600 text-sm hover:underline block text-center"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CreateParcel;
