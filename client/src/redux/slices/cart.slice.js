import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    count: 0,
    items: [], // 🔥 cart items
  },
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload;
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.count = action.payload.length;
    },
    incrementCart: (state) => {
      state.count += 1;
    },
    decrementCart: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
    clearCart: (state) => {
      state.count = 0;
      state.items = [];
    },
  },
});

export const {
  setCartCount,
  setCartItems,
  incrementCart,
  decrementCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
