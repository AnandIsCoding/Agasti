import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setUser } from "../redux/slices/auth.slice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function GoogleLoginComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("Google authentication failed");
      return;
    }

    const token = credentialResponse.credential;
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/google`,
        { token },
        { withCredentials: true },
      );

      const { data } = res;

      if (data?.success) {
        dispatch(setUser(data.user));
        toast.success(data.message || "Login successful");
        navigate("/products");
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch (error) {
      console.error(
        "Error in handleGoogleSuccess in GoogleLoginComponent.jsx ---->>",
        error,
      );
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center my-4">
      {loading ? (
        /* 🔹 LOADER UI */
        <Box
          sx={{
            width: 280,
            height: 44,
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e5e7eb",
            bgcolor: "#fff",
          }}
        >
          <CircularProgress size={22} />
        </Box>
      ) : (
        /* 🔹 GOOGLE LOGIN BUTTON */
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            toast.error("Google Login Failed");
          }}
          theme="outline"
          size="large"
          shape="pill"
          width="280"
        />
      )}
    </div>
  );
}
