// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [roleChanges, setRoleChanges] = useState({});
  const [agentAssignments, setAgentAssignments] = useState({});

  useEffect(() => {
    // TODO: Fetch all users and all parcels from backend
    // Example:
    // axios.get('/api/admin/users')
    // axios.get('/api/parcels')

    const dummyUsers = [
      { id: 1, name: "John Doe", role: "user" },
      { id: 2, name: "Jane Agent", role: "agent" },
      { id: 3, name: "Mary Admin", role: "admin" },
    ];

    const dummyParcels = [
      { id: 101, description: "Clothes to Nakuru", agentId: null },
      { id: 102, description: "Phone to Nairobi", agentId: 2 },
    ];

    setUsers(dummyUsers);
    setParcels(dummyParcels);
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setRoleChanges((prev) => ({ ...prev, [userId]: newRole }));
  };

  const applyRoleChange = (userId) => {
    const newRole = roleChanges[userId];
    if (!newRole) return;

    // TODO: Send role update to backend
    // axios.put(`/api/admin/users/${userId}/role`, { role: newRole })

    console.log(`Updated user ${userId} to role: ${newRole}`);

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setRoleChanges((prev) => ({ ...prev, [userId]: "" }));
  };

  const assignAgent = (parcelId) => {
    const agentId = agentAssignments[parcelId];
    if (!agentId) return;

    // TODO: Send agent assignment to backend
    // axios.put(`/api/parcels/${parcelId}/assign`, { agentId })

    console.log(`Assigned agent ${agentId} to parcel ${parcelId}`);

    setParcels((prev) =>
      prev.map((p) => (p.id === parcelId ? { ...p, agentId } : p))
    );
    setAgentAssignments((prev) => ({ ...prev, [parcelId]: "" }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* User Management */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Manage Users</h2>
        <table className="w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b text-center">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <select
                    value={roleChanges[user.id] || ""}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
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
      <section>
        <h2 className="text-xl font-semibold mb-3">Assign Agents to Parcels</h2>
        <div className="space-y-4">
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-white p-4 border rounded shadow-sm"
            >
              <p className="mb-2 font-medium">{parcel.description}</p>
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
                        {agent.name}
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
