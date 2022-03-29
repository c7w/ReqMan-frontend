import { createSlice } from "@reduxjs/toolkit";

export const serviceSlice = createSlice({
  name: "service",
  initialState: {
    service: "",
  },
  reducers: {
    updateServiceStore: (state, action) => {
      state.service = action.payload;
    },
  },
});

export const { updateServiceStore } = serviceSlice.actions;
export const getServiceStore = (state: any) => {
  return state.service_store.service;
};

export default serviceSlice.reducer;
