import { createSlice } from "@reduxjs/toolkit";

export const ProjectSlice = createSlice({
  name: "project_slice",
  initialState: {
    project: "",
  },
  reducers: {
    updateProjectStore: (state, action) => {
      state.project = action.payload;
    },
  },
});

export const { updateProjectStore } = ProjectSlice.actions;
export const getProjectStore = (state: any) => {
  return state.project_store.project;
};

export default ProjectSlice.reducer;
