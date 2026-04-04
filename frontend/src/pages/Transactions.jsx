import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getTransactions, createTransaction,
    updateTransaction, deleteTransaction
} from "../api/transactions";

const emptyForm = { amount: "", type: "INCOME", category: "", date: "", notes: "" };

export default function Transactions() {
    const { user } = useAuth();
    const canWrite = user?.role === "ADMIN" || user?.role === "ANALYST";
    const canDelete = user?.role === "ADMIN";

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [filters, setFilters] = useState({ type: "", category: "", from: "", to: "" });

    // Form
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            // Remove empty filter values
            const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
            const res = await getTransactions(params);
            setTransactions(res.data.data || res.data);
        } catch {
            setError("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTransactions(); }, []);

    const handleFilterChange = e => setFilters(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleFormChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleEdit = (t) => {
        setEditId(t.id);
        setForm({ amount: t.amount, type: t.type, category: t.category, date: t.date?.slice(0, 10), notes: t.notes || "" });
        setShowForm(true);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            if (editId) {
                await updateTransaction(editId, { ...form, amount: parseFloat(form.amount) });
            } else {
                await createTransaction({ ...form, amount: parseFloat(form.amount) });
            }
            setShowForm(false);
            setForm(emptyForm);
            setEditId(null);
            fetchTransactions();
        } catch {
            setError("Failed to save transaction");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this transaction?")) return;
        try {
            await deleteTransaction(id);
            fetchTransactions();
        } catch {
            setError("Failed to delete");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-800">Transactions</h1>
                {canWrite && (
                    <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                        + New Transaction
                    </button>
                )}
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-4 flex flex-wrap gap-3 border border-gray-200">
                <select name="type" value={filters.type} onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>
                <input name="category" value={filters.category} onChange={handleFilterChange}
                    placeholder="Category" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                <input name="from" type="date" value={filters.from} onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                <input name="to" type="date" value={filters.to} onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                <button onClick={fetchTransactions}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
                    Apply
                </button>
                <button onClick={() => { setFilters({ type: "", category: "", from: "", to: "" }); setTimeout(fetchTransactions, 0); }}
                    className="text-gray-500 text-sm px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Clear
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                {loading ? (
                    <p className="text-center text-gray-400 py-10">Loading...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">No transactions found</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Notes</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                {canWrite && <th className="px-4 py-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{t.date?.slice(0, 10)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === "INCOME" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 capitalize">{t.category}</td>
                                    <td className="px-4 py-3 text-gray-500">{t.notes || "—"}</td>
                                    <td className="px-4 py-3 text-right font-medium">₹{t.amount}</td>
                                    {canWrite && (
                                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                                            <button onClick={() => handleEdit(t)}
                                                className="text-indigo-600 hover:underline text-xs">Edit</button>
                                            {canDelete && (
                                                <button onClick={() => handleDelete(t.id)}
                                                    className="text-red-500 hover:underline text-xs">Delete</button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold mb-4">{editId ? "Edit Transaction" : "New Transaction"}</h2>
                        <div className="space-y-3">
                            <input name="amount" type="number" value={form.amount} onChange={handleFormChange}
                                placeholder="Amount" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                            <select name="type" value={form.type} onChange={handleFormChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm">
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                            <input name="category" value={form.category} onChange={handleFormChange}
                                placeholder="Category (e.g. salary, food)" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                            <input name="date" type="date" value={form.date} onChange={handleFormChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                            <input name="notes" value={form.notes} onChange={handleFormChange}
                                placeholder="Notes (optional)" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                        </div>
                        <div className="flex justify-end gap-3 mt-5">
                            <button onClick={() => { setShowForm(false); setEditId(null); }}
                                className="text-gray-500 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={submitting}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                                {submitting ? "Saving..." : editId ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}