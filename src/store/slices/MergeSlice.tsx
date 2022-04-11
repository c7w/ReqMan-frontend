import { createSlice } from "@reduxjs/toolkit";

export const MergeSlice = createSlice({
  name: "merge_slice",
  initialState: {
    merge: "",
  },
  reducers: {
    updateMergeStore: (state, action) => {
      state.merge = action.payload;
    },
  },
});

export const { updateMergeStore } = MergeSlice.actions;
export const getMergeStore = (state: any) => {
  return state.merge_store.merge;
};

export default MergeSlice.reducer;
