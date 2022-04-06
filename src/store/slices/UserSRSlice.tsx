import { createSlice } from "@reduxjs/toolkit";

export const UserSRSlice = createSlice({
  name: "user_SR_slice",
  initialState: {
    user_sr: "",
  },
  reducers: {
    updateUserSRStore: (state, action) => {
      state.user_sr = action.payload;
    },
  },
});

export const { updateUserSRStore } = UserSRSlice.actions;
export const getUserSRStore = (state: any) => {
  return state.user_sr_store.user_sr;
};

export default UserSRSlice.reducer;
