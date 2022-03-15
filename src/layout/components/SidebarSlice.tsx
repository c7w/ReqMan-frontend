import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isCollapsed: false,
  },
  reducers: {
    updateIsCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
  },
});

export const { updateIsCollapsed } = sidebarSlice.actions;
export const getIsCollapsed = (state: any) => {
  return state.sidebar.isCollapsed;
};

export default sidebarSlice.reducer;
