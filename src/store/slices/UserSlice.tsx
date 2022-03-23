import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
  name: "user_slice",
  initialState: {
    user: "",
  },
  reducers: {
    updateUserStore: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { updateUserStore } = UserSlice.actions;
export const getUserStore = (state: { user_store: { user: string } }) => {
  return state.user_store.user;
};

export default UserSlice.reducer;
