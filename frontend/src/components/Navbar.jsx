import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between overflow-x-auto">
            {/* Left — Logo */}
            <div className="flex items-center gap-6">
                <span className="font-bold text-indigo-600 text-lg">FinanceApp</span>

                {/* Nav links based on role */}
                <div className="flex gap-4 text-sm font-medium">
                    <Link to="/transactions" className="text-gray-600 hover:text-indigo-600 transition">
                        Transactions
                    </Link>

                    {/* ANALYST + ADMIN only */}
                    {(user?.role === "ANALYST" || user?.role === "ADMIN") && (
                        <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 transition">
                            Dashboard
                        </Link>
                    )}

                    {/* ADMIN only */}
                    {user?.role === "ADMIN" && (
                        <Link to="/users" className="text-gray-600 hover:text-indigo-600 transition">
                            Users
                        </Link>
                    )}
                </div>
            </div>

            {/* Right — user info + logout */}
            <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">{user?.email}</span>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {user?.role}
                </span>
                <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 font-medium transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}