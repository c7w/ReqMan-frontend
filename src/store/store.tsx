import { configureStore, createSlice } from "@reduxjs/toolkit";

const colorEditorSlice = createSlice({
  name: "ExampleSlice",
  initialState: {
    currColorIndex: 0,
  },
  reducers: {
    updateCurrColorIndex: (state, action) => {
      state.currColorIndex = action.payload;
    },
  },
});

export const { updateCurrColorIndex } = colorEditorSlice.actions;

export const getCurrColorIndex = (state: any) => {
  return state.colorEditor.currColorIndex;
};

export default configureStore({
  reducer: {
    colorEditor: colorEditorSlice.reducer,
  },
});
