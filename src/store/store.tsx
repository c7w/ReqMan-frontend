import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../layout/components/SidebarSlice";

export default configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});
