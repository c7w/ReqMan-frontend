import { createSlice } from "@reduxjs/toolkit";

export const IterationSlice = createSlice({
  name: "iteration_slice",
  initialState: {
    iteration: "",
    SRIteration: "",
  },
  reducers: {
    // 更新迭代
    updateIterationStore: (state, action) => {
      state.iteration = action.payload;
    },
    updateSRIterationStore: (state, action) => {
      state.SRIteration = action.payload;
    },
  },
});

export const { updateIterationStore, updateSRIterationStore } =
  IterationSlice.actions;

export const getIterationStore = (state: {
  iteration_store: { iteration: string };
}) => {
  return state.iteration_store.iteration;
};

export const getSRIterationStore = (state: {
  iteration_store: { SRIteration: string };
}) => {
  return state.iteration_store.SRIteration;
};

export default IterationSlice.reducer;
