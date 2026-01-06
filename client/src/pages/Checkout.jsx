import { Box, Button, Divider, TextField } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  addAddressApi,
  createCODOrderApi,
  getAddressesApi,
  initiatePhonePePaymentApi,
  updateAddressApi,
} from "../api/api";
import Footer from "../components/Footer";
import FreeShippingBanner from "../components/Landing/FreeShippingBanner";
import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- REDUX ---------------- */
  const { user } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items || []);

  /* ---------------- ROUTE DATA ---------------- */
  const checkoutType = location.state?.type; // BUY_NOW | CART
  const buyNowProduct = location.state?.product;

  /* ---------------- STATE ---------------- */
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [addressSaved, setAddressSaved] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [codLoading, setCodLoading] = useState(false);

  const [billing, setBilling] = useState({
    fullName: "",
    email: "",
    country: "",
    address1: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
  });

  /* ---------------- GUARD ---------------- */
  useEffect(() => {
    if (!checkoutType) {
      toast.error("Invalid checkout access");
      navigate("/");
    }
  }, [checkoutType, navigate]);

  /* ---------------- PREFILL USER ---------------- */
  useEffect(() => {
    if (user) {
      setBilling((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        mobile: user.phone || "",
      }));
    }
  }, [user]);

  /* ---------------- FETCH ADDRESSES ---------------- */
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await getAddressesApi();

      if (res.success && res.addresses.length) {
        setAddresses(res.addresses);
        setAddressSaved(true);
        setIsEditingAddress(false);

        const def = res.addresses.find((a) => a.status) || res.addresses[0];

        setSelectedAddressId(def._id);
        prefillBilling(def);
      } else {
        setAddressSaved(false);
        setIsEditingAddress(true);
      }
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoadingAddress(false);
    }
  };

  const prefillBilling = (addr) => {
    setBilling((prev) => ({
      ...prev,
      country: addr.country || "",
      address1: addr.address_line || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      mobile: addr.mobile || prev.mobile,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- SAVE / UPDATE ADDRESS ---------------- */
  const handleSaveAddress = async () => {
    if (
      !billing.fullName ||
      !billing.country ||
      !billing.address1 ||
      !billing.city ||
      !billing.state ||
      !billing.pincode ||
      !billing.mobile
    ) {
      return toast.error("Please fill all address fields");
    }

    setSavingAddress(true);

    const payload = {
      fullName: billing.fullName,
      country: billing.country,
      address_line: billing.address1,
      city: billing.city,
      state: billing.state,
      pincode: billing.pincode,
      mobile: billing.mobile,
    };

    try {
      // ✅ UPDATE
      if (selectedAddressId) {
        await updateAddressApi(selectedAddressId, payload);
        toast.success("Address updated");
      }
      // ✅ CREATE
      else {
        await addAddressApi(payload);
        toast.success("Address added");
      }

      setIsEditingAddress(false);
      await fetchAddresses();
    } catch (error) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  /* ---------------- ORDER ITEMS ---------------- */
  const orderItems =
    checkoutType === "BUY_NOW"
      ? [
          {
            productId: buyNowProduct._id,
            title: buyNowProduct.name,
            price: buyNowProduct.price,
            quantity: buyNowProduct.quantity,
            image: buyNowProduct.image,
          },
        ]
      : cartItems.map((item) => ({
          productId: item.product._id,
          title: item.product.name,
          price: item.product.offerPrice || item.product.price,
          quantity: item.quantity,
          image: item.product.images?.[0],
        }));

  const totalAmount = orderItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  /* ---------------- PLACE ORDER ---------------- */

  const [paying, setPaying] = useState(false);

  const handlePlaceOrder = async () => {
    if (!addressSaved || !selectedAddressId) {
      return toast.error("Please save address first");
    }

    const requiredAddressFields = {
      country: billing.country,
      address1: billing.address1,
      city: billing.city,
      state: billing.state,
      pincode: billing.pincode,
      mobile: billing.mobile,
    };

    const hasMissingField = Object.values(requiredAddressFields).some(
      (v) => !v || v.toString().trim() === "",
    );

    if (hasMissingField) {
      return toast.error("Please complete all address fields");
    }

    if (!orderItems.length) {
      return toast.error("No items to checkout");
    }

    const payload = {
      userId: user._id,
      addressId: selectedAddressId,
      checkoutType,
      totalAmount,
      products: orderItems.map((i) => ({
        productId: i.productId,
        price: i.price,
        quantity: i.quantity,
      })),
    };

    try {
      setPaying(true);
      toast.loading("Redirecting to payment...", { id: "pay" });

      const res = await initiatePhonePePaymentApi(payload);

      toast.dismiss("pay");

      if (!res.success) {
        setPaying(false);
        return toast.error(res.message);
      }

      // 🔥 Redirect to PhonePe
      window.location.href = res.redirectUrl;
    } catch {
      toast.dismiss("pay");
      setPaying(false);
      toast.error("Payment failed");
    }
  };

  const buildPayload = () => ({
    userId: user._id,
    addressId: selectedAddressId,
    checkoutType,
    totalAmount,
    products: orderItems.map((i) => ({
      productId: i.productId,
      price: i.price,
      quantity: i.quantity,
    })),
  });

  /* ---------------- COD ---------------- */
  const handleCODOrder = async () => {
    if (!addressSaved) return toast.error("Save address first");

    try {
      setCodLoading(true);
      toast.loading("Placing COD order...", { id: "cod" });

      const res = await createCODOrderApi(buildPayload());
      toast.dismiss("cod");

      if (!res.success) throw new Error(res.message);

      toast.success("Order placed successfully");
      navigate("/profile");
    } catch (err) {
      toast.dismiss("cod");
      toast.error(err.message || "COD order failed");
    } finally {
      setCodLoading(false);
    }
  };

  return (
    <motion.div className="bg-white min-h-screen ">
      <Navbar />
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
        {/* ---------------- BILLING ---------------- */}
        <div className="md:w-[65%]">
          <Box className="border rounded-md p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Billing Details</h2>

            {!loadingAddress &&
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => {
                    setSelectedAddressId(addr._id);
                    prefillBilling(addr);
                  }}
                  className={`border rounded-md p-3 cursor-pointer mb-2 ${
                    selectedAddressId === addr._id
                      ? "border-black bg-gray-50"
                      : ""
                  }`}
                >
                  {addr.address_line}, {addr.city}
                </div>
              ))}

            <MuiInput label="Full Name" value={billing.fullName} disabled />
            <MuiInput
              label="Country"
              name="country"
              value={billing.country}
              onChange={handleChange}
              disabled={addressSaved && !isEditingAddress}
            />
            <MuiInput
              label="Address"
              name="address1"
              value={billing.address1}
              onChange={handleChange}
              disabled={addressSaved && !isEditingAddress}
            />
            <MuiInput
              label="City"
              name="city"
              value={billing.city}
              onChange={handleChange}
              disabled={addressSaved && !isEditingAddress}
            />
            <MuiInput
              label="State"
              name="state"
              value={billing.state}
              onChange={handleChange}
              disabled={addressSaved && !isEditingAddress}
            />
            <MuiInput
              label="Pincode"
              name="pincode"
              value={billing.pincode}
              onChange={handleChange}
              disabled={addressSaved && !isEditingAddress}
            />
            <MuiInput
              label="Mobile"
              name="mobile"
              value={billing.mobile}
              onChange={handleChange}
              disabled={addressSaved && !isEditingAddress}
            />
            <MuiInput label="Email" value={billing.email} disabled />

            {addressSaved && !isEditingAddress && (
              <Button
                fullWidth
                sx={{ mt: 3, bgcolor: "orange", color: "white" }}
                variant="outlined"
                onClick={() => setIsEditingAddress(true)}
              >
                CLICK ME TO EDIT YOUR ADDRESS
              </Button>
            )}

            {(!addressSaved || isEditingAddress) && (
              <Button
                fullWidth
                sx={{ mt: 3, bgcolor: "green", color: "white" }}
                variant="contained"
                onClick={handleSaveAddress}
                disabled={savingAddress}
              >
                {savingAddress
                  ? "Saving..."
                  : addressSaved
                    ? "Update Address"
                    : "Save Address"}
              </Button>
            )}
          </Box>
        </div>

        {/* ---------------- ORDER SUMMARY ---------------- */}
        <div className="md:w-[35%]">
          <Box className="border rounded-md p-6 shadow-sm sticky top-20">
            {orderItems.map((item) => (
              <div key={item.productId} className="flex gap-4 py-3">
                <img
                  src={item.image || "/NoImageAvailable.jpeg"}
                  alt={item.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-sm">
                    ₹ {item.price} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">₹ {item.price * item.quantity}</p>
              </div>
            ))}

            <Divider sx={{ my: 2 }} />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹ {totalAmount}</span>
            </div>

            <Button
              fullWidth
              sx={{ mt: 3, bgcolor: "green" }}
              variant="contained"
              disabled={paying}
              onClick={handlePlaceOrder}
            >
              {paying ? "Processing Payment..." : "Place Order"}
            </Button>

            <Button
              fullWidth
              sx={{ mt: 2 }}
              variant="outlined"
              onClick={handleCODOrder}
              disabled={codLoading || paying}
            >
              {codLoading ? "Placing Order..." : "Cash on Delivery"}
            </Button>

            {!addressSaved && (
              <p className="text-red-600 text-sm mt-2 text-center">
                Please save address to place order
              </p>
            )}
          </Box>
        </div>
      </div>

      <FreeShippingBanner />
      <Footer />
    </motion.div>
  );
}

/* ---------------- INPUT ---------------- */
const MuiInput = (props) => (
  <TextField
    fullWidth
    size="small"
    margin="normal"
    InputLabelProps={{ shrink: true }}
    {...props}
  />
);

export default Checkout;
