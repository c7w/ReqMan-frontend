import { createSlice } from "@reduxjs/toolkit";

export const RepoSlice = createSlice({
  name: "repo_slice",
  initialState: {
    repo: "",
  },
  reducers: {
    updateRepoStore: (state, action) => {
      state.repo = action.payload;
    },
  },
});

export const { updateRepoStore } = RepoSlice.actions;
export const getRepoStore = (state: any) => {
  return state.repo_store.repo;
};

export default RepoSlice.reducer;
