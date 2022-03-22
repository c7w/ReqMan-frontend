import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./slices/SidebarSlice";
import UserSliceReducer from "./slices/UserSlice";

export default configureStore({
  reducer: {
    sidebar: sidebarReducer,
    user_store: UserSliceReducer,
  },
});
