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
export const getIsCollapsed = (state: {
  sidebar: { isCollapsed: boolean };
}) => {
  return state.sidebar.isCollapsed;
};

export default sidebarSlice.reducer;
