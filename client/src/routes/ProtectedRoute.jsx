import { CircularProgress } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user, loading } = useSelector((state) => state.user);

  // 🔄 Loading state (important for refresh / hydration)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ Logged in user
  return <Outlet />;
}
