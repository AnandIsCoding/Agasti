import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/slices/auth.slice.js";
import cartReducer from "../redux/slices/cart.slice.js";
import categoryReducer from "../redux/slices/category.slice.js";
import categoryFilterReducer from "../redux/slices/categoryFilterSlice.slice.js";

const appStore = configureStore({
  reducer: {
    user: authReducer,
    categories: categoryReducer,
    cart: cartReducer,

    categoryFilter: categoryFilterReducer,
  },
});

export default appStore;
