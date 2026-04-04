import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "VIEWER" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.post("/auth/register", form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
                <p className="text-gray-500 text-sm mb-6">Register to access the dashboard</p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Shreyas" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="you@example.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" value={form.password} onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select name="role" value={form.role} onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="VIEWER">Viewer</option>
                            <option value="ANALYST">Analyst</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition">
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-4">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}