import { createSlice } from "@reduxjs/toolkit";

export const IterationSlice = createSlice({
  name: "iteration_slice",
  initialState: {
    iteration: "",
    SRIteration: "",
    IRIteration: "",
    UserIteration: "",
  },
  reducers: {
    // 更新迭代
    updateIterationStore: (state, action) => {
      state.iteration = action.payload;
    },
    updateIRIterationStore: (state, action) => {
      state.IRIteration = action.payload;
    },
    updateSRIterationStore: (state, action) => {
      state.SRIteration = action.payload;
    },
    updateUserIterationStore: (state, action) => {
      state.UserIteration = action.payload;
    },
  },
});

export const {
  updateIterationStore,
  updateIRIterationStore,
  updateSRIterationStore,
  updateUserIterationStore,
} = IterationSlice.actions;

export const getIterationStore = (state: {
  iteration_store: { iteration: string };
}) => {
  return state.iteration_store.iteration;
};

export const getIRIterationStore = (state: {
  iteration_store: { IRIteration: string };
}) => {
  return state.iteration_store.IRIteration;
};

export const getSRIterationStore = (state: {
  iteration_store: { SRIteration: string };
}) => {
  return state.iteration_store.SRIteration;
};

export const getUserIterationStore = (state: {
  iteration_store: { UserIteration: string };
}) => {
  return state.iteration_store.UserIteration;
};

export default IterationSlice.reducer;
