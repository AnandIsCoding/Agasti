import React from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../sidebar/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* FIXED SIDEBAR */}
      <div className="w-64 fixed left-0 top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="ml-64 flex-1 h-screen overflow-y-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
