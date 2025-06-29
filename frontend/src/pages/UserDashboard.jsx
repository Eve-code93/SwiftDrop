// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AccountTile from "../components/AccountTile";

function UserDashboard() {
  const [parcels, setParcels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await axios.get("/parcels");
        setParcels(response.data);
      } catch (error) {
        console.error("Error fetching parcels:", error);
      }
    };

    fetchParcels();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          SwiftDrop
        </h1>
        <div className="flex gap-4 items-center text-sm">
          <button
            onClick={() => navigate("/parcels/new")}
            className="text-indigo-600 hover:underline"
          >
            Send a Parcel
          </button>

          {parcels.length > 0 && (
            <button
              onClick={() => navigate(`/parcels/${parcels[0].id}`)}
              className="text-indigo-600 hover:underline"
            >
              Track My Parcel
            </button>
          )}

          <button
            onClick={() => navigate("/profile")}
            className="text-gray-700 hover:underline"
          >
            My Account
          </button>
          <button
            onClick={handleLogout}
            className="text-red-600 font-medium hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Tiles */}
      <main className="p-6 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AccountTile
            title="Total Orders"
            value={parcels.length}
            icon="src/assets/myorders.png"
          />
          <AccountTile
            title="Delivered"
            value={parcels.filter((p) => p.status === "delivered").length}
            icon="src/assets/profilesettings.png"
            color="text-green-600"
          />
          <AccountTile
            title="In Transit"
            value={parcels.filter((p) => p.status === "in_transit").length}
            icon="src/assets/transit-icon.svg"
            color="text-blue-600"
          />
        </section>

        {/* Parcel List */}
        <section className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold mb-4">My Parcels</h2>
          {parcels.length === 0 ? (
            <p className="text-gray-500 text-sm">No parcels found.</p>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Destination</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((parcel) => (
                  <tr
                    key={parcel.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/parcels/${parcel.id}`)}
                  >
                    <td className="p-2">#{parcel.id}</td>
                    <td className="p-2">{parcel.description}</td>
                    <td className="p-2">{parcel.destination}</td>
                    <td className="p-2 capitalize text-indigo-600">
                      {parcel.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
