import axios from "axios";
import toast from "react-hot-toast";

import { setLoading, setUser } from "../redux/slices/auth.slice";
import { setCategories } from "../redux/slices/category.slice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/* ===============================
   Logout 
================================ */

export const handleLogout = async (dispatch, navigate) => {
  const toastId = toast.loading("Logging out...");

  try {
    dispatch(setLoading(true));

    const res = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      { withCredentials: true },
    );

    const { data } = res;

    if (data?.success) {
      dispatch(setUser(null));
      dispatch(setLoading(false));

      toast.success(data?.message || "Logged out successfully", {
        id: toastId,
      });

      navigate("/auth", { replace: true });
    } else {
      throw new Error(data?.message || "Logout failed");
    }
  } catch (error) {
    dispatch(setLoading(false));

    console.error("❌ Logout Error:", error);

    toast.error(
      error?.response?.data?.message || "Logout failed. Please try again.",
      { id: toastId },
    );
  }
};

/* ===============================
   CREATE CATEGORY (ADMIN ONLY)
================================ */

export const createCategory = async (formData) => {
  const toastId = toast.loading("Creating category...");
  try {
    const res = await axios.post(`${BASE_URL}/category/create`, formData, {
      withCredentials: true, // ✅ only this
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { data } = res;

    if (!data?.success) {
      throw new Error(data?.message || "Category creation failed");
    }
    toast.success("Category created successfully 🎉", {
      id: toastId,
    });
    return data;
  } catch (error) {
    console.error("❌ Create Category Error:", error);
    toast.error(
      error?.response?.data?.message ||
        "Failed to create category. Please try again.",
      { id: toastId },
    );

    throw error;
  }
};

/* ===============================
   GET ALL CATEGORY
================================ */
export const getAllCategory = async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/category/all`, {
      withCredentials: true, // ✅ cookie-based auth
    });

    const { data } = res;

    if (!data?.success) {
      throw new Error(data?.message || "Failed to fetch categories");
    }
    dispatch(setCategories(data?.data));

    return data;
  } catch (error) {
    console.error("❌ Get All Category Error:", error);

    toast.error(
      error?.response?.data?.message ||
        "Failed to fetch categories. Please try again.",
    );

    throw error;
  }
};

/* ===============================
   UPDATE CATEGORY (ADMIN ONLY)
================================ */

export const updateCategory = async (dispatch, categoryId, formData) => {
  const toastId = toast.loading("Updating category...");

  try {
    const res = await axios.put(
      `${BASE_URL}/category/update/${categoryId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const { data } = res;

    if (!data?.success) {
      throw new Error(data?.message || "Category update failed");
    }

    toast.success("Category updated successfully ✅", {
      id: toastId,
    });

    await getAllCategory(dispatch);
    return data;
  } catch (error) {
    console.error("❌ Update Category Error:", error);

    toast.error(
      error?.response?.data?.message ||
        "Failed to update category. Please try again.",
      { id: toastId },
    );

    throw error;
  }
};

/* ===============================
   DELETE CATEGORY BY ID (ADMIN ONLY)
================================ */

export const deleteCategoryById = async (dispatch, categoryId) => {
  const toastId = toast.loading("Deleting category..."); // show loading toast
  try {
    const res = await axios.delete(
      `${BASE_URL}/category/delete/${categoryId}`,
      { withCredentials: true },
    );

    // Success toast
    toast.success("Category deleted successfully!", { id: toastId });

    // Optionally, update Redux store
    dispatch({ type: "DELETE_CATEGORY", payload: categoryId });

    return res.data;
  } catch (error) {
    console.error("❌ Failed to delete category -->> ", error);

    // Error toast
    toast.error(error?.response?.data?.message || "Failed to delete category", {
      id: toastId,
    });

    throw error;
  }
};

/**
 * CREATE PRODUCT
 */
export const createProduct = async (formData) => {
  const toastId = toast.loading("Creating product...");
  try {
    const res = await axios.post(`${BASE_URL}/product/create`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Product created successfully!", { id: toastId });
    return res.data;
  } catch (error) {
    console.error("❌ Create Product Error:", error);

    toast.error(error?.response?.data?.message || "Failed to create product", {
      id: toastId,
    });

    throw error;
  }
};

/* ===============================
   GET ALL PRODUCTS
================================ */

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/product/all`, {
      withCredentials: true,
    });

    const { data } = res;

    if (!data?.success) {
      throw new Error(data?.message || "Failed to fetch products");
    }

    return data.data; // 👈 only products array
  } catch (error) {
    console.error("❌ Get All Products Error:", error);

    toast.error(
      error?.response?.data?.message ||
        "Failed to load products. Please try again.",
    );

    throw error;
  }
};

/* ---------------- UPDATE PRODUCT only admin ---------------- */

export const updateProduct = async (productId, formData) => {
  const toastId = toast.loading("Updating product...");

  try {
    const res = await axios.put(
      `${BASE_URL}/product/update/${productId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    toast.success("Product updated successfully", { id: toastId });
    return res.data;
  } catch (error) {
    console.error("❌ Update Product Error:", error);

    toast.error(error?.response?.data?.message || "Failed to update product", {
      id: toastId,
    });

    throw error;
  }
};

//  delete product admin only

export const deleteProduct = async (id) => {
  const toastId = toast.loading("Deleting product...");
  try {
    const res = await axios.delete(`${BASE_URL}/product/delete/${id}`, {
      withCredentials: true,
    });

    toast.success("Product deleted successfully", { id: toastId });
    return res.data;
  } catch (error) {
    console.error("❌ Delete Product Error:", error);
    toast.error(error?.response?.data?.message || "Failed to delete product", {
      id: toastId,
    });
    throw error;
  }
};

/* ===============================
   GET PRODUCT BY ID
================================ */
export const getProductById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/product/${id}`, {
      withCredentials: true,
    });

    return res.data?.data;
  } catch (error) {
    console.error("❌ Get Product By ID Error:", error);

    toast.error(error?.response?.data?.message || "Failed to load product");

    throw error;
  }
};

/* ===============================
   GET CART COUNT
================================ */
export const getCartCount = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/cart/count`, {
      withCredentials: true,
    });

    return res.data.count;
  } catch (error) {
    console.error("❌ Cart count error:", error);
    return 0;
  }
};

// toggle cart

export const toggleCart = async ({ productId, quantity }) => {
  const toastId = toast.loading("Updating cart...");
  try {
    const res = await axios.post(
      `${BASE_URL}/cart/toggle`,
      { productId, quantity },
      { withCredentials: true },
    );

    toast.success(res.data.message || "Cart updated", { id: toastId });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Cart update failed", {
      id: toastId,
    });
    throw error;
  }
};

// my cart

export const getCartItems = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/cart/mycart`, {
      withCredentials: true,
    });

    return {
      cartItems: res.data.data || [],
      cartCount: res.data.count || 0,
    };
  } catch (error) {
    console.error("❌ Get Cart Error:", error);
    return { cartItems: [], cartCount: 0 };
  }
};

//  profile

// Update user profile
export const updateProfileApi = async (data) => {
  try {
    const res = await axios.put(`${BASE_URL}/auth/profile/update`, data, {
      withCredentials: true,
    });
    return {
      success: res.data.success,
      user: res.data.user || null,
      message: res.data.message || "",
    };
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    return {
      success: false,
      user: null,
      message: error.message || "Failed to update profile",
    };
  }
};

// Add address
export const addAddressApi = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/address`, data, {
      withCredentials: true,
    });
    return {
      success: res.data.success,
      address: res.data.address || null,
      message: res.data.message || "",
    };
  } catch (error) {
    console.error("❌ Add Address Error:", error);
    return {
      success: false,
      address: null,
      message: error.message || "Failed to add address",
    };
  }
};

/* =========================
   UPDATE EXISTING ADDRESS
========================= */
export const updateAddressApi = async (addressId, payload) => {
  try {
    const { data } = await axios.put(
      `${BASE_URL}/auth/address/${addressId}`,
      payload,
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update address" };
  }
};

// Get addresses
export const getAddressesApi = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/address`, {
      withCredentials: true,
    });
    return {
      success: res.data.success,
      addresses: res.data.addresses || [],
      message: res.data.message || "",
    };
  } catch (error) {
    console.error("❌ Get Addresses Error:", error);
    return {
      success: false,
      addresses: [],
      message: error.message || "Failed to fetch addresses",
    };
  }
};

/**
 * Generic GET request handler
 * @param {string} endpoint - API endpoint (e.g., "/admin/dashboard/stats")
 * @returns {Promise<any>}
 */

export const getdashboardStatsData = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/admin/dashboard/stats`, {
      withCredentials: true, // if you need cookies/auth
    });

    if (res.data?.success) {
      return res.data;
    } else {
      toast.error(res.data?.message || "Something went wrong!");
      return null;
    }
  } catch (error) {
    console.error("[API ERROR]", error);
    toast.error(error.response?.data?.message || "Failed to fetch data");
    return null;
  }
};

/* ================= PHONEPE ================= */

// 1️⃣ INITIATE PAYMENT
export const initiatePhonePePaymentApi = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/order/phonepe/initiate`, data, {
      withCredentials: true,
    });

    return {
      success: true,
      redirectUrl: res.data.redirectUrl,
    };
  } catch (error) {
    console.error("❌ PhonePe Initiate Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Payment initiation failed",
    };
  }
};

// 2️⃣ VERIFY PAYMENT (after redirect)
export const verifyPhonePePaymentApi = async (transactionId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/order/phonepe/verify`,
      { transactionId },
      { withCredentials: true },
    );

    return res.data;
  } catch (error) {
    console.error("❌ PhonePe Verify Error:", error);
    return {
      success: false,
      message: "Payment verification failed",
    };
  }
};

// my orders , user

export const getMyOrdersApi = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/order/my-orders`, {
      withCredentials: true,
    });
    return data.orders;
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Failed to fetch orders");
    return [];
  }
};

// Get all orders (admin)
export const getAllOrders = async () => {
  const res = await axios.get(`${BASE_URL}/order/admin/all-orders`, {
    withCredentials: true,
  });
  return res.data;
};

// Update delivery status (admin)
export const updateDeliveryStatus = async (orderId, status) => {
  const res = await axios.patch(
    `${BASE_URL}/order/admin/orders/${orderId}/delivery`,
    { status }, // <-- payload
    { withCredentials: true }, // <-- config
  );
  return res.data;
};

/* ===============================
   REVIEWS
================================ */

// Get reviews of a product (PUBLIC)
export const getProductReviews = async (productId) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/review/product/${productId}`,
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    console.error("❌ Get Reviews Error:", error);
    throw error.response?.data || { message: "Failed to load reviews" };
  }
};

// Check if user purchased product (AUTH)
export const checkPurchasedProduct = async (productId) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/review/check/${productId}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("❌ Check Purchase Error:", error);
    throw error.response?.data || { message: "Failed to check purchase" };
  }
};

// Create review (AUTH)
export const createReview = async (payload) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/review`, payload, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("❌ Create Review Error:", error);
    throw error.response?.data || { message: "Failed to submit review" };
  }
};

/* =====================================================
   COD – CREATE ORDER
===================================================== */
export const createCODOrderApi = async (payload) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/order/cod/create`, payload, {
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.error("❌ COD Order Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Failed to place COD order",
      }
    );
  }
};
