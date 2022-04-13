import { createSlice } from "@reduxjs/toolkit";

export const IssueSlice = createSlice({
  name: "issue_slice",
  initialState: {
    issues: "",
    commit: "",
    merge: "",
    mr_sr: "",
  },
  reducers: {
    updateIssueStore: (state, action) => {
      state.issues = action.payload;
    },
    updateCommitStore: (state, action) => {
      state.commit = action.payload;
    },
    updateMergeStore: (state, action) => {
      state.merge = action.payload;
    },
    updateMRSRAssociationStore: (state, action) => {
      state.mr_sr = action.payload;
    },
  },
});

export const {
  updateIssueStore,
  updateCommitStore,
  updateMergeStore,
  updateMRSRAssociationStore,
} = IssueSlice.actions;

export const getIssueStore = (state: any) => {
  return state.issue_store.issues;
};
export const getCommitStore = (state: any) => {
  return state.issue_store.commit;
};
export const getMergeStore = (state: any) => {
  return state.issue_store.merge;
};
export const getMRSRAssociationStore = (state: any) => {
  return state.issue_store.mr_sr;
};

export default IssueSlice.reducer;
