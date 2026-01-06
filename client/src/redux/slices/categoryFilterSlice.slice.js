import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategory: null, // { _id, name } OR null
};

const categoryFilterSlice = createSlice({
  name: "categoryFilter",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
});

export const { setSelectedCategory, clearSelectedCategory } =
  categoryFilterSlice.actions;

export default categoryFilterSlice.reducer;
