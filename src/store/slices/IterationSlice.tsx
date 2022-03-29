import { createSlice } from "@reduxjs/toolkit";

export const IterationSlice = createSlice({
  name: "iteration_slice",
  initialState: {
    iteration: "",
  },
  reducers: {
    // 更新迭代
    updateIterationStore: (state, action) => {
      state.iteration = action.payload;
    },
  },
});

export const { updateIterationStore } = IterationSlice.actions;

export const getIterationStore = (state: {
  iteration_store: { iteration: string };
}) => {
  return state.iteration_store.iteration;
};

export default IterationSlice.reducer;
