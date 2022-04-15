import { createSlice } from "@reduxjs/toolkit";

export const CalendarSlice = createSlice({
  name: "calendar_slice",
  initialState: {
    todoSRList: "{}",
    wipSRList: "{}",
    reviewSRList: "{}",
    counter: 0,
  },
  reducers: {
    updateTodoSRList: (state, action) => {
      state.todoSRList = action.payload;
    },
    updateWipSRList: (state, action) => {
      state.wipSRList = action.payload;
    },
    updateReviewSRList: (state, action) => {
      state.reviewSRList = action.payload;
    },
    updateCounter: (state, action) => {
      state.counter++;
    },
  },
});

export const {
  updateTodoSRList,
  updateWipSRList,
  updateReviewSRList,
  updateCounter,
} = CalendarSlice.actions;

export const getTodoSRListStore = (state: {
  calendar_store: { todoSRList: string };
}) => {
  return state.calendar_store.todoSRList;
};

export const getWipSRListStore = (state: {
  calendar_store: { wipSRList: string };
}) => {
  return state.calendar_store.wipSRList;
};

export const getReviewSRListStore = (state: {
  calendar_store: { reviewSRList: string };
}) => {
  return state.calendar_store.reviewSRList;
};

export const getCounterStore = (state: {
  calendar_store: { counter: number };
}) => {
  return state.calendar_store.counter;
};

export default CalendarSlice.reducer;
