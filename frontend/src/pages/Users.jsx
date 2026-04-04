import { useEffect, useState } from "react";
import { getUsers, updateRole, updateStatus } from "../api/users";

const ROLES = ["VIEWER", "ANALYST", "ADMIN"];

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data.data || res.data);
        } catch {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (id, role) => {
        try {
            await updateRole(id, role);
            fetchUsers();
        } catch {
            setError("Failed to update role");
        }
    };

    const handleStatusToggle = async (id, isActive) => {
        try {
            await updateStatus(id, !isActive);
            fetchUsers();
        } catch {
            setError("Failed to update status");
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold text-gray-800 mb-6">Users</h1>

            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <p className="text-center text-gray-400 py-10">Loading...</p>
                ) : users.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">No users found</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{u.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={u.role}
                                            onChange={e => handleRoleChange(u.id, e.target.value)}
                                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                                        >
                                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {u.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleStatusToggle(u.id, u.isActive)}
                                            className={`text-xs font-medium px-3 py-1 rounded-lg border transition ${u.isActive ? "border-red-300 text-red-500 hover:bg-red-50" : "border-green-300 text-green-600 hover:bg-green-50"}`}
                                        >
                                            {u.isActive ? "Deactivate" : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}