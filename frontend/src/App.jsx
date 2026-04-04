import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
// import './App.css'


export default function App() {



  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* All logged-in roles */}
      <Route path="/transactions" element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      } />

      {/* ANALYST + ADMIN only */}
      <Route path="/dashboard" element={
        <ProtectedRoute roles={["ADMIN", "ANALYST"]}>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* ADMIN only */}
      <Route path="/users" element={
        <ProtectedRoute roles={["ADMIN"]}>
          <Users />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

