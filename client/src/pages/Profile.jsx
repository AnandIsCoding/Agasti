import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getMyOrdersApi, handleLogout, updateAddressApi } from "../api/api";
import { addAddressApi, getAddressesApi, updateProfileApi } from "../api/api";
import Footer from "../components/Footer";
import FreeShippingBanner from "../components/Landing/FreeShippingBanner";
import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";
import { setUser } from "../redux/slices/auth.slice";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Navigation />
      <div className="bg-white px-4 md:px-16 py-10">
        <h1 className="text-2xl font-semibold mb-8">Account Overview</h1>

        <div className="flex flex-col md:flex-row gap-10">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 border rounded-md p-6"
          >
            {activeTab === "personal" && <PersonalInfo />}
            {activeTab === "address" && <AddressBook />}
            {activeTab === "order" && <Orders />}
            {activeTab === "logout" && (
              <Logout dispatch={dispatch} navigate={navigate} />
            )}
          </motion.div>
        </div>
      </div>
      <FreeShippingBanner />
      <Footer />
    </>
  );
};

/* ================= SIDEBAR ================= */
const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "personal", label: "Personal Information" },
    { key: "address", label: "Address Book" },
    { key: "order", label: "Order" },
    { key: "logout", label: "Logout" },
  ];

  return (
    <div className="w-full md:w-64 border rounded-md">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`w-full text-left px-4 cursor-pointer py-3 border-b text-md flex justify-between items-center ${
            activeTab === tab.key ? "bg-black text-white" : "hover:bg-gray-100"
          }`}
        >
          {tab.label}
          <span>›</span>
        </button>
      ))}
    </div>
  );
};

/* ================= PERSONAL INFO ================= */
const PersonalInfo = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    profilePic: user.profilePic || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);

    // Show loader toast
    const toastId = toast.loading("Please wait...");

    try {
      const res = await updateProfileApi(formData);

      if (res.success && res.user) {
        dispatch(setUser(res.user));
        toast.success(res.message || "Profile updated successfully", {
          id: toastId,
        });
        setEdit(false);
      } else {
        toast.error(res.message || "Failed to update profile", { id: toastId });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile", { id: toastId });
    }

    setLoading(false);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

      {!edit ? (
        <div className="flex items-start gap-6">
          <img
            src={user.profilePic || import.meta.env.VITE_DEFAULT_PROFILE_PIC}
            alt={user.name}
            className="w-17 h-17 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = import.meta.env.VITE_DEFAULT_PROFILE_PIC;
            }}
          />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-base">{user.name}</p>
            <p>{user.phone || "N/A"}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Status: {user.status}</p>
            <button
              onClick={() => setEdit(true)}
              className="mt-2 text-sm bg-black text-white px-6 rounded-sm py-1"
            >
              Edit
            </button>
            {user?.role === "ADMIN" && (
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/admin")}
                sx={{
                  mt: 3,
                  py: 1.5,
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#111",
                  },
                }}
              >
                Go to Admin Panel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />
          {/* Optional: profilePic input */}
          <div className="col-span-2 flex gap-4 mt-2">
            <Button onClick={handleSave} disabled={loading} variant="contained">
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={() => {
                setEdit(false);
                setFormData({
                  name: user.name,
                  phone: user.phone,
                  profilePic: user.profilePic,
                });
              }}
              variant="outlined"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

/* ================= ADDRESS BOOK ================= */
const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    mobile: "",
  });

  /* ---------------- FETCH ADDRESSES ---------------- */
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await getAddressesApi();
      if (res.success) {
        setAddresses(res.addresses || []);

        if (res.addresses?.length) {
          const def = res.addresses.find((a) => a.status) || res.addresses[0];
          setSelectedAddressId(def._id);
        }
      }
    } catch {
      toast.error("Failed to fetch addresses");
    }
  };

  /* ---------------- PREFILL FOR EDIT ---------------- */
  const handleEdit = (addr) => {
    setFormData({
      address_line: addr.address_line,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
      mobile: addr.mobile,
    });
    setSelectedAddressId(addr._id);
    setIsEditing(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ---------------- SAVE (ADD / UPDATE) ---------------- */
  const handleSaveAddress = async () => {
    const { address_line, city, state, pincode, mobile } = formData;

    if (!address_line || !city || !state || !pincode || !mobile) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);
    const toastId = toast.loading(
      selectedAddressId ? "Updating address..." : "Saving address...",
    );

    try {
      if (selectedAddressId) {
        await updateAddressApi(selectedAddressId, formData);
        toast.success("Address updated", { id: toastId });
      } else {
        await addAddressApi(formData);
        toast.success("Address added", { id: toastId });
      }

      setIsEditing(false);
      setFormData({
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        mobile: "",
      });

      await fetchAddresses();
    } catch (error) {
      toast.error(error.message || "Failed to save address", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const hasAddress = addresses.length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Address Book</h2>

      {/* ================= ADDRESS DISPLAY ================= */}
      {hasAddress && !isEditing && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`border p-5 rounded-md shadow ${
                addr.status ? "bg-green-50 border-green-400" : "bg-white"
              }`}
            >
              <p className="font-medium">{addr.address_line}</p>
              <p>
                {addr.city}, {addr.state}, {addr.pincode}
              </p>
              <p>{addr.country}</p>
              <p>Mobile: {addr.mobile}</p>

              <Button
                size="small"
                variant="contained"
                className="mt-3"
                onClick={() => handleEdit(addr)}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD BUTTON ================= */}
      {!hasAddress && !isEditing && (
        <Button variant="contained" onClick={() => setIsEditing(true)}>
          Add Address
        </Button>
      )}

      {/* ================= FORM (ADD / EDIT) ================= */}
      {isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Address Line"
            name="address_line"
            value={formData.address_line}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            fullWidth
          />

          <div className="col-span-2 flex gap-4">
            <Button
              variant="contained"
              onClick={handleSaveAddress}
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={18} color="inherit" />
              }
            >
              {loading ? "Saving..." : "Save Address"}
            </Button>

            <Button
              variant="outlined"
              disabled={loading}
              onClick={() => {
                setIsEditing(false);
                setSelectedAddressId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= ORDERS ================= */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await getMyOrdersApi();

        if (!Array.isArray(res)) {
          throw new Error("Invalid orders response");
        }

        setOrders(res);
      } catch (err) {
        toast.error(err.message || "Failed to fetch orders");
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length)
    return (
      <p className="text-sm text-gray-500">
        You have not placed any orders yet.
      </p>
    );

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Order ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Delivery Status</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <OrderRow key={order._id} order={order} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

/* ================= LOGOUT ================= */
const Logout = ({ dispatch, navigate }) => (
  <div className="flex flex-col items-center bg-white py-6 px-5 w-full">
    <div className="flex items-center justify-center p-4 bg-red-100 rounded-full">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75"
          stroke="#DC2626"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <h2 className="text-gray-900 font-semibold mt-4 text-xl">
      Are you sure? You want to Logout
    </h2>
    <p className="text-sm text-gray-600 mt-2 text-center">
      Do you really want to continue? This action cannot be undone.
    </p>
    <div className="flex items-center justify-center gap-4 mt-5 w-full">
      <button
        onClick={() => handleLogout(dispatch, navigate)}
        type="button"
        className="w-full cursor-pointer md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
      >
        Confirm
      </button>
    </div>
  </div>
);

/* ================= INPUT ================= */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      {...props}
      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
    />
  </div>
);

/* ================= ORDER ROW ================= */
/* ================= ORDER ROW ================= */
function OrderRow({ order }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order._id}</TableCell>
        <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
        <TableCell>
          <Chip
            label={order.deliveryStatus}
            size="small"
            color={order.deliveryStatus === "Delivered" ? "success" : "warning"}
          />
        </TableCell>
        <TableCell align="right">
          ₹{order.totalAmount.toLocaleString()}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, bgcolor: "#fafafa" }}>
              {/* Delivery Details */}
              <Typography variant="subtitle2" gutterBottom>
                Delivery Details
              </Typography>
              <Typography fontSize={14}>
                Customer Address: {order.address?.address_line},{" "}
                {order.address?.city}, {order.address?.state},{" "}
                {order.address?.pincode}, {order.address?.country}
              </Typography>
              <Typography fontSize={14}>
                Mobile: {order.address?.mobile}
              </Typography>
              <Typography fontSize={14} color="error">
                Payment Status: {order.paymentStatus}
              </Typography>
              <Typography fontSize={14} color="text.secondary" mb={2}>
                Delivery Status: {order.deliveryStatus}
              </Typography>
              {order.invoice?.url && (
                <Typography fontSize={14} mb={2}>
                  Invoice:{" "}
                  <a
                    href={order.invoice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Invoice
                  </a>
                </Typography>
              )}

              {/* Ordered Items */}
              <Typography variant="subtitle2" gutterBottom>
                Ordered Items
              </Typography>
              {order.products?.map((item, i) => (
                <Box
                  key={i}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mb={1.5}
                >
                  <img
                    src={item.img || "https://via.placeholder.com/60"}
                    alt={item.name}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 6,
                      objectFit: "cover",
                    }}
                  />
                  <Box flex={1}>
                    <Typography fontSize={14} fontWeight={500}>
                      {item.name}
                    </Typography>
                    <Typography fontSize={13} color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography fontSize={14}>₹{item.price}</Typography>
                </Box>
              ))}

              {/* Subtotal & Total */}
              <Box mt={2}>
                <Typography fontSize={14}>
                  Subtotal: ₹{order.subTotalAmount}
                </Typography>
                <Typography fontSize={14} fontWeight={600}>
                  Total: ₹{order.totalAmount}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Profile;
