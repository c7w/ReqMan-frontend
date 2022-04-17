import { createSlice } from "@reduxjs/toolkit";

export const SRChangeLogSlice = createSlice({
  name: "sr_changelog_slice",
  initialState: {
    SRChangeLog: "",
  },
  reducers: {
    updateSRChangeLog: (state, action) => {
      state.SRChangeLog = action.payload;
    },
  },
});

export const { updateSRChangeLog } = SRChangeLogSlice.actions;

export const getSRChangLogStore = (state: {
  sr_changelog_store: { SRChangeLog: string };
}) => {
  return state.sr_changelog_store.SRChangeLog;
};

export default SRChangeLogSlice.reducer;
