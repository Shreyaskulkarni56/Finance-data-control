import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getSummary, getCategories, getTrends, getRecent } from "../api/dashboard";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [trends, setTrends] = useState([]);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [s, c, t, r] = await Promise.all([
                    getSummary(), getCategories(), getTrends(), getRecent()
                ]);

                setSummary(s.data.data);

                // categories: object { salary: {...}, food: {...} } → array
                const catData = c.data.data;
                setCategories(Object.entries(catData).map(([category, val]) => ({
                    category,
                    total: val.income + val.expense  // 👈 fix this line
                })));

                // console.log("catData:", catData);
                // console.log("catData entries:", Object.entries(catData));

                // trends: object { "2024-03": {...} } → array
                const trendData = t.data.data;
                setTrends(Object.entries(trendData).map(([month, val]) => ({
                    month,
                    income: val.income || 0,
                    expense: val.expense || 0
                })));

                setRecent(r.data.data || []);
            } catch {
                setError("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <p className="text-center text-gray-400 py-20">Loading dashboard...</p>;
    if (error) return <p className="text-center text-red-500 py-20">{error}</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">₹{summary?.totalIncome ?? 0}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-500">₹{summary?.totalExpenses ?? 0}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Net Balance</p>
                    <p className={`text-2xl font-bold ${(summary?.netBalance ?? 0) >= 0 ? "text-indigo-600" : "text-red-500"}`}>
                        ₹{summary?.netBalance ?? 0}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4">
                {/* Monthly Trends */}
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Monthly Trends</h2>
                    {trends.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-10">No data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={trends}>
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="income" fill="#10b981" name="Income" />
                                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <ResponsiveContainer width="100%" height={200} style={{ outline: "none" }}>
                        <PieChart style={{ outline: "none", border: "none" }}>
                            <Pie data={categories} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={80} stroke="none">
                                {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Color legend */}
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {categories.map((cat, i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-gray-600">
                                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                <span className="capitalize">{cat.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-700">Recent Transactions</h2>
                </div>
                {recent.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">No recent transactions</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recent.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{t.date?.slice(0, 10)}</td>
                                    <td className="px-4 py-3 capitalize">{t.category}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === "INCOME" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">₹{t.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}