import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [roleChanges, setRoleChanges] = useState({});
  const [agentAssignments, setAgentAssignments] = useState({});
  const [metrics, setMetrics] = useState({
    total_parcels: 0,
    delivered: 0,
    in_transit: 0,
    pending: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("/admin/users");
        setUsers(usersResponse.data);

        const parcelsResponse = await axios.get("/parcels");
        setParcels(parcelsResponse.data);

        const metricsResponse = await axios.get("/admin/metrics");
        setMetrics(metricsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleRoleChange = (userId, newRole) => {
    setRoleChanges((prev) => ({ ...prev, [userId]: newRole }));
  };

  const applyRoleChange = async (userId) => {
    const newRole = roleChanges[userId];
    if (!newRole) return;

    try {
      await axios.put(`/admin/users/${userId}`, { role: newRole }); // ✅ Fixed URL
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setRoleChanges((prev) => ({ ...prev, [userId]: "" }));
    } catch (error) {
      console.error("Error changing user role:", error);
      alert("Failed to change user role. Please try again.");
    }
  };

  const assignAgent = async (parcelId) => {
    const agentId = agentAssignments[parcelId];
    if (!agentId) return;

    try {
      await axios.post("/admin/assign", {
        parcel_id: parcelId,
        agent_id: agentId,
      });

      setParcels((prev) =>
        prev.map((parcel) =>
          parcel.id === parcelId
            ? { ...parcel, agent_id: agentId } // ✅ Updated to match backend field
            : parcel
        )
      );
      setAgentAssignments((prev) => ({ ...prev, [parcelId]: "" }));
    } catch (error) {
      console.error("Error assigning agent:", error);
      alert("Failed to assign agent. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Parcel Stats */}
      <section className="bg-white p-6 rounded shadow grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-500">Total Parcels</h3>
          <p className="text-2xl font-semibold text-gray-800">
            {metrics.total_parcels}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
          <p className="text-2xl font-semibold text-green-600">
            {metrics.delivered}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-500">In Transit</h3>
          <p className="text-2xl font-semibold text-blue-600">
            {metrics.in_transit}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-semibold text-yellow-600">
            {metrics.pending}
          </p>
        </div>
      </section>

      {/* User Management */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
        <table className="w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b text-center">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <select
                    value={roleChanges[user.id] || ""}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="">Select Role</option>
                    <option value="user">Sender</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => applyRoleChange(user.id)}
                    className="ml-2 bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    Change
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Assign Agents */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Assign Agents to Parcels</h2>
        <div className="space-y-4">
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-gray-100 p-4 border rounded shadow-sm"
            >
              <p className="mb-2 font-medium">
                Parcel #{parcel.id} — {parcel.description || "No description"}
              </p>
              <div className="flex items-center space-x-2">
                <select
                  value={agentAssignments[parcel.id] || ""}
                  onChange={(e) =>
                    setAgentAssignments((prev) => ({
                      ...prev,
                      [parcel.id]: Number(e.target.value),
                    }))
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option value="">Select Agent</option>
                  {users
                    .filter((u) => u.role === "agent")
                    .map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.email}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => assignAgent(parcel.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
