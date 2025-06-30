import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        const [usersResponse, parcelsResponse, metricsResponse] = await Promise.all([
          axios.get("/admin/users"),
          axios.get("/parcels"),
          axios.get("/admin/metrics")
        ]);

        setUsers(usersResponse.data);
        setParcels(parcelsResponse.data);
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
      await axios.put(`/admin/users/${userId}/role`, { role: newRole });
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
    <div className="min-h-screen bg-[#f7f7f8]">
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-[#5c5470]">SwiftDrop Admin Panel</h1>
          <div className="flex gap-4">
            <Link
              to="/"
              className="px-4 py-2 bg-[#726d91] text-white text-sm rounded hover:bg-[#5c5470]"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#b45f06] text-white text-sm rounded hover:bg-[#944f05]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(metrics).map(([key, value]) => {
            const labels = {
              total_parcels: "Total Parcels",
              delivered: "Delivered",
              in_transit: "In Transit",
              pending: "Pending",
            };
            return (
              <div key={key} className="bg-white p-4 rounded shadow text-center">
                <p className="text-sm text-gray-500">{labels[key]}</p>
                <p className="text-2xl font-bold text-[#5c5470]">{value}</p>
              </div>
            );
          })}
        </section>

        <section className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-[#5c5470] mb-4">Manage Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f0eef3]">
                  <th className="p-3 text-sm font-medium text-[#5c5470]">Email</th>
                  <th className="p-3 text-sm font-medium text-[#5c5470]">Role</th>
                  <th className="p-3 text-sm font-medium text-[#5c5470]">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3 text-sm text-gray-700">{user.email}</td>
                    <td className="p-3 text-sm text-gray-600 capitalize">{user.role}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <select
                          value={roleChanges[user.id] || ""}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="">Select Role</option>
                          <option value="user">User</option>
                          <option value="agent">Agent</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => applyRoleChange(user.id)}
                          className="bg-[#726d91] hover:bg-[#5c5470] text-white px-3 py-1 rounded text-sm"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold text-[#5c5470] mb-4">Assign Agents to Parcels</h2>
          <div className="space-y-4">
            {parcels.map((parcel) => (
              <div key={parcel.id} className="border rounded p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#5c5470]">Parcel #{parcel.id}</p>
                    <p className="text-sm text-gray-500">{parcel.description || "No description"}</p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <select
                      value={agentAssignments[parcel.id] || ""}
                      onChange={(e) =>
                        setAgentAssignments((prev) => ({ ...prev, [parcel.id]: Number(e.target.value) }))
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select Agent</option>
                      {users.filter((u) => u.role === "agent").map((agent) => (
                        <option key={agent.id} value={agent.id}>{agent.email}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => assignAgent(parcel.id)}
                      disabled={assigning[parcel.id]}
                      className={`text-white px-3 py-1 rounded text-sm ${assigning[parcel.id] ? "bg-gray-400" : "bg-[#6c91bf] hover:bg-[#5273a3]"}`}
                    >
                      {assigning[parcel.id] ? "Assigning..." : "Assign"}
                    </button>
                  </div>
                </div>
                {parcel.assigned_agent && (
                  <p className="mt-2 text-sm text-green-600">Assigned to: {users.find((u) => u.id === parcel.assigned_agent)?.email}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#f0eef3] border-t mt-8 py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} SwiftDrop Admin. All rights reserved.
      </footer>
    </div>
  );
}

export default AdminDashboard;