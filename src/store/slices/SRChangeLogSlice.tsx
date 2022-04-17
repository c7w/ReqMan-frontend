import { createSlice } from "@reduxjs/toolkit";

export const SRChangeLogSlice = createSlice({
  name: "sr_changelog_slice",
  initialState: {
    SRChangeLog: "",
  },
  reducers: {
    updateSRChangeLogStore: (state, action) => {
      state.SRChangeLog = action.payload;
    },
  },
});

export const { updateSRChangeLogStore } = SRChangeLogSlice.actions;

export const getSRChangeLogStore = (state: {
  sr_changelog_store: { SRChangeLog: string };
}) => {
  return state.sr_changelog_store.SRChangeLog;
};

export default SRChangeLogSlice.reducer;
