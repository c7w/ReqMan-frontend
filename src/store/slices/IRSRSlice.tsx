import { createSlice } from "@reduxjs/toolkit";
import { SRCard } from "../ConfigureStore";

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

// test SR
export const getSR =
  (id: number) => (state: { rms: { SRList: Array<SRCard> } }) => {
    // test
    return {
      id: 0, // id
      project: "test", // the project belongs to
      title: "SR.002.103", // title
      description:
        " hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard ! hbx is working hard !", // description
      priority: 0, // the priority which indicates the importance of the SR
      currState: "TODO", // "TODO", "WIP", "Reviewing", "Done"
      createdBy: "hbx", // somebody
      createdAt: new Date().getDate(), // sometime
      disabled: false,
    };
    // return state.rms.SRList[id];
  };

export default IRSRSlice.reducer;
