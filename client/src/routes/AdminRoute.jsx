import { CircularProgress } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const { user, loading } = useSelector((state) => state.user);

  // 🔄 Loading
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

  // ❌ Logged in but not admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin access
  return <Outlet />;
}
