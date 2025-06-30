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
      });

      setSuccess("Parcel created successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("Failed to create parcel:", err);
      setError("Failed to create parcel. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f8] p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#5c5470] mb-4 text-center">
          Create a New Parcel
        </h1>

        {error && (
          <p className="text-red-500 bg-red-100 border border-red-300 p-2 rounded text-sm mb-4 text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 bg-green-50 border border-green-200 p-2 rounded text-sm mb-4 text-center">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Laptop to Nakuru"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#726d91]"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Nakuru"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#726d91]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#726d91] hover:bg-[#5c5470] text-white font-medium py-2 rounded-lg transition"
          >
            Submit Parcel
          </button>
        </form>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-5 text-[#726d91] hover:underline text-sm block text-center"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CreateParcel;
