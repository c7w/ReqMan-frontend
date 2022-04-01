import { createSlice } from "@reduxjs/toolkit";

export const serviceSlice = createSlice({
  name: "service",
  initialState: {
    service: "",
    SRService: "",
  },
  reducers: {
    updateServiceStore: (state, action) => {
      state.service = action.payload;
    },
    updateSRServiceStore: (state, action) => {
      state.SRService = action.payload;
    },
  },
});

export const { updateServiceStore, updateSRServiceStore } =
  serviceSlice.actions;

export const getServiceStore = (state: {
  service_store: { service: string };
}) => {
  return state.service_store.service;
};

export const getSRServiceStore = (state: {
  service_store: { SRService: string };
}) => {
  return state.service_store.SRService;
};

export default serviceSlice.reducer;
