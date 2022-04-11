import { createSlice } from "@reduxjs/toolkit";

export const IssueSlice = createSlice({
  name: "issue_slice",
  initialState: {
    issues: "",
  },
  reducers: {
    updateIssueStore: (state, action) => {
      state.issues = action.payload;
    },
  },
});

export const { updateIssueStore } = IssueSlice.actions;
export const getIssueStore = (state: any) => {
  return state.issue_store.issues;
};

export default IssueSlice.reducer;
