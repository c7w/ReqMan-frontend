import { createSlice } from "@reduxjs/toolkit";

export const IRSRSlice = createSlice({
  name: "ir_sr_slice",
  initialState: {
    IRList: "",
    SRList: "",
    IR_SR: "",
  },
  reducers: {
    // 增删性能待调整，是否允许换位显示？
    updateIRListStore: (state, action) => {
      state.IRList = action.payload;
    },
    // 修改 SR 需求 ( payload 为 SR 信息)
    updateSRListStore: (state, action) => {
      state.SRList = action.payload;
    },
    // 修改 IR-SR 联系
    updateIRSRStore: (state, action) => {
      state.IR_SR = action.payload;
    },
  },
});

export const { updateIRListStore, updateSRListStore, updateIRSRStore } =
  IRSRSlice.actions;

export const getIRListStore = (state: { ir_sr_store: { IRList: string } }) => {
  return state.ir_sr_store.IRList;
};

export const getSRListStore = (state: { ir_sr_store: { SRList: string } }) => {
  return state.ir_sr_store.SRList;
};

export const getIRSRStore = (state: { ir_sr_store: { IR_SR: string } }) => {
  return state.ir_sr_store.IR_SR;
};

export default IRSRSlice.reducer;
