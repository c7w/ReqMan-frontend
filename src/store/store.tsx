import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../layout/components/sidebarSlice";

export default configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});
