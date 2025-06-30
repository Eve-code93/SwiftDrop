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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-gray-100 to-white">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1
          className="text-2xl font-bold text-[#5c5470] tracking-wide cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          SwiftDrop
        </h1>
        <div className="flex gap-4 items-center text-sm font-medium">
          <button
            onClick={() => navigate("/parcels/new")}
            className="text-[#726d91] hover:underline transition"
          >
            Send Parcel
          </button>
          <button
            onClick={() => navigate("/track")}
            className="text-[#726d91] hover:underline transition"
          >
            Track Parcel
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-700 hover:underline transition"
          >
            My Account
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="p-6 sm:p-10 space-y-10">
        {/* Tiles */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AccountTile
            title="Total Orders"
            value={parcels.length}
            icon="src/assets/myorders.png"
            color="text-[#5c5470]"
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
            color="text-[#726d91]"
          />
        </section>

        {/* Parcel Table */}
        <section className="bg-white/90 rounded-xl shadow-md p-6 border border-purple-100">
          <h2 className="text-xl font-semibold text-[#5c5470] mb-4">
            📦 My Parcels
          </h2>

          {parcels.length === 0 ? (
            <p className="text-gray-500 text-sm">No parcels found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-auto">
                <thead className="bg-[#eeeaf7] text-[#5c5470] font-medium">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Destination</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="border-b hover:bg-purple-50 transition cursor-pointer"
                      onClick={() => navigate(`/parcels/${parcel.id}`)}
                    >
                      <td className="p-3 font-semibold text-[#5c5470]">
                        #{parcel.id}
                      </td>
                      <td className="p-3 text-gray-700">
                        {parcel.description}
                      </td>
                      <td className="p-3 text-gray-700">
                        {parcel.destination}
                      </td>
                      <td className="p-3 capitalize font-medium text-[#726d91]">
                        {parcel.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;

