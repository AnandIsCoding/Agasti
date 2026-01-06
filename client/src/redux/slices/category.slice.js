import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [], // Initially null, will be set via API later
  loading: true,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCategories, setLoading } = categorySlice.actions;
export default categorySlice.reducer;
