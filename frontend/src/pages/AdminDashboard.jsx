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
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Modern Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-sm text-gray-500">Manage users and parcels</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        {/* Metrics Cards */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(metrics).map(([key, value]) => {
            const config = {
              total_parcels: { color: "bg-gray-100", text: "Total Parcels" },
              delivered: { color: "bg-green-50", text: "Delivered" },
              in_transit: { color: "bg-blue-50", text: "In Transit" },
              pending: { color: "bg-yellow-50", text: "Pending" },
            }[key];
            
            return (
              <div key={key} className={`${config.color} overflow-hidden rounded-lg shadow px-4 py-5 sm:p-6`}>
                <dt className="text-sm font-medium text-gray-500 truncate">{config.text}</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
              </div>
            );
          })}
        </section>

        {/* User Management */}
        <section className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">User Management</h2>
            <p className="mt-1 text-sm text-gray-500">Update user roles and permissions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <select
                          value={roleChanges[user.id] || ""}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select Role</option>
                          <option value="user">User</option>
                          <option value="agent">Agent</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => applyRoleChange(user.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

        {/* Parcel Assignment */}
        <section className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Parcel Assignments</h2>
            <p className="mt-1 text-sm text-gray-500">Assign delivery agents to parcels</p>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-4">
            {parcels.map((parcel) => (
              <div key={parcel.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-3 sm:mb-0">
                    <h3 className="text-base font-medium text-gray-900">Parcel #{parcel.id}</h3>
                    <p className="text-sm text-gray-500">{parcel.description || "No description provided"}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={agentAssignments[parcel.id] || ""}
                      onChange={(e) =>
                        setAgentAssignments((prev) => ({
                          ...prev,
                          [parcel.id]: Number(e.target.value),
                        }))
                      }
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                        assigning[parcel.id]
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      }`}
                    >
                      {assigning[parcel.id] ? "Assigning..." : "Assign"}
                    </button>
                  </div>
                </div>
                {parcel.assigned_agent && (
                  <div className="mt-3 text-sm text-green-600 font-medium">
                    Currently assigned to: {users.find((u) => u.id === parcel.assigned_agent)?.email}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Delivery App Admin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AdminDashboard;