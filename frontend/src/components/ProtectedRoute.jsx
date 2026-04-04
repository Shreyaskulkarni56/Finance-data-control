import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// roles = array of allowed roles, e.g. ['ADMIN', 'ANALYST']
// if no roles passed, just checks if logged in
export default function ProtectedRoute({ children, roles }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}