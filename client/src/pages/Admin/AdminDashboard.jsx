import {
  Inventory2,
  People,
  ShoppingCart,
  Star,
  WarningAmber,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getdashboardStatsData } from "../../api/api";

const iconComponents = {
  People: People,
  ShoppingCart: ShoppingCart,
  Inventory2: Inventory2,
  Star: Star,
};

const gradientClasses = {
  People: "bg-gradient-to-r from-green-400 to-green-600",
  ShoppingCart: "bg-gradient-to-r from-pink-400 to-purple-500",
  Inventory2: "bg-gradient-to-r from-blue-400 to-blue-600",
  Star: "bg-gradient-to-r from-yellow-400 to-orange-500",
};

function AdminDashboard() {
  const { user } = useSelector((state) => state.user);
  const adminName = user?.name || "";

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getdashboardStatsData();
        if (data?.stats) {
          const statsWithType = data.stats.map((item) => ({
            ...item,
            type: item.icon,
          }));
          setStats(statsWithType);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>

      {/* STAT CARDS */}
      {loading ? (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = iconComponents[item.type] || Star;
            return (
              <div
                key={index}
                className={`rounded-xl p-6 text-white shadow-lg ${gradientClasses[item.type]} transition-transform duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{item.label}</p>
                    <p className="text-3xl font-bold mt-2">{item.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center">
                    <Icon fontSize="large" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HELLO ADMIN */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-[#f5f0e5] rounded-lg shadow-md">
        <div>
          <h2 className="text-4xl sm:text-6xl font-bold">
            Hello, Admin {adminName} 👋
          </h2>
          <p className="text-gray-600 mt-2">
            Welcome back to your admin dashboard
          </p>
        </div>
        <img
          onClick={() => navigate("/")}
          src="/logo.png"
          alt="Admin Logo"
          className="h-20 sm:h-28 object-contain cursor-pointer"
        />
      </div>

      {/* ADMIN NOTICE ALERT */}
      <div className="border border-yellow-400 bg-yellow-50 rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <WarningAmber className="text-yellow-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-700">
              Important Admin Guidelines / महत्वपूर्ण एडमिन निर्देश
            </h3>

            {/* ENGLISH */}
            <div className="mt-3">
              <h4 className="font-semibold text-gray-800 mb-1">📌 English</h4>
              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                <li>
                  While creating <b>products, categories, brands, etc.</b>,
                  always focus on <b>creation accuracy</b>.
                </li>
                <li>
                  Ensure <b>all required fields</b> are properly filled before
                  submitting.
                </li>
                <li>
                  Prepare product/category data in a <b>sheet or document</b>{" "}
                  before actual creation.
                </li>
                <li>
                  Add <b>detailed product information</b> in the{" "}
                  <b>`longDescription`</b> field.
                </li>
                <li>
                  Avoid frequent edits after creation —{" "}
                  <b>create it right the first time</b>.
                </li>
                <li>
                  Double-check{" "}
                  <b>images, pricing, stock, and category mapping</b> before
                  saving.
                </li>
                <li>
                  Product creation may sometimes{" "}
                  <b>take a few seconds to load</b>. Be patient.
                </li>
                <li>
                  If network is stable and action still takes time, wait and do
                  not refresh repeatedly.
                </li>
                <li>
                  In case of unexpected error, blank screen, or failure, note
                  the action and contact the <b>Developer / Technical Team</b>.
                </li>
                <li>
                  Avoid creating the same product/category multiple times while
                  processing.
                </li>
              </ul>
            </div>

            {/* HINDI */}
            <div className="mt-4 border-t pt-3">
              <h4 className="font-semibold text-gray-800 mb-1">📌 हिंदी</h4>
              <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                <li>
                  प्रोडक्ट, कैटेगरी, ब्रांड आदि बनाते समय{" "}
                  <b>सटीकता (Accuracy)</b> पर ध्यान दें।
                </li>
                <li>
                  सबमिट करने से पहले <b>सभी आवश्यक फ़ील्ड</b> भरें।
                </li>
                <li>डेटा को शीट या डॉक्यूमेंट में तैयार रखें।</li>
                <li>
                  <b>पूरी और विस्तृत जानकारी</b> `longDescription` फ़ील्ड में
                  डालें।
                </li>
                <li>
                  बार-बार एडिट करने से बचें —{" "}
                  <b>पहली बार में सही तरीके से बनाएं</b>।
                </li>
                <li>इमेज, प्राइस, स्टॉक और कैटेगरी मैपिंग जरूर जांच लें।</li>
                <li>
                  सिस्टम प्रोसेसिंग के दौरान{" "}
                  <b>एक ही प्रोडक्ट/कैटेगरी दोबारा न बनाएं</b>।
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
