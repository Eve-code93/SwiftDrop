import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [roleChanges, setRoleChanges] = useState({});
  const [agentAssignments, setAgentAssignments] = useState({});
  const [assigning, setAssigning] = useState({});
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
        toast.error("Failed to load dashboard data.");
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
      toast.success("Role updated successfully.");
    } catch (error) {
      console.error("Error changing user role:", error);
      toast.error("Failed to change user role.");
    }
  };

  const assignAgent = async (parcelId) => {
    const agentId = agentAssignments[parcelId];
    if (!agentId) {
      toast.warning("Please select an agent before assigning.");
      return;
    }

    setAssigning((prev) => ({ ...prev, [parcelId]: true }));

    const previousParcels = [...parcels];
    setParcels((prev) =>
      prev.map((parcel) =>
        parcel.id === parcelId ? { ...parcel, assigned_agent: agentId } : parcel
      )
    );

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
      toast.success("Agent assigned successfully.");
    } catch (error) {
      console.error("Assignment error:", error);
      setParcels(previousParcels);
      toast.error("Failed to assign agent. Try again.");
    } finally {
      setAssigning((prev) => ({ ...prev, [parcelId]: false }));
    }
  };

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-red-600 font-semibold px-4 py-2 rounded hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Parcel Metrics */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 rounded-xl shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-6">
        {Object.entries(metrics).map(([key, value]) => {
          const config = {
            total_parcels: {
              color: "text-gray-800",
              icon: "📦",
              label: "Total Parcels",
            },
            delivered: {
              color: "text-green-600",
              icon: "✅",
              label: "Delivered",
            },
            in_transit: {
              color: "text-blue-600",
              icon: "🚚",
              label: "In Transit",
            },
            pending: {
              color: "text-yellow-600",
              icon: "⏳",
              label: "Pending",
            },
          }[key];

          return (
            <div
              key={key}
              className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{config.icon}</div>
              <h3 className="text-sm font-medium text-gray-500">
                {config.label}
              </h3>
              <p className={`text-2xl font-bold ${config.color}`}>{value}</p>
            </div>
          );
        })}
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
              <div className="flex flex-wrap items-center gap-2">
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
                  disabled={assigning[parcel.id]}
                  className={`px-3 py-1 rounded ${
                    assigning[parcel.id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {assigning[parcel.id] ? "Assigning..." : "Assign"}
                </button>
                {parcel.assigned_agent && (
                  <span className="text-sm text-green-700 font-medium ml-2">
                    Assigned to:{" "}
                    {users.find((u) => u.id === parcel.assigned_agent)?.email}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
