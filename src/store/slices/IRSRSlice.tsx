import { createSlice } from "@reduxjs/toolkit";
import { SRCard } from "../ConfigureStore";

export const IRSRSlice = createSlice({
  name: "ir_sr_slice",
  initialState: {
    IRList: "",
    SRList: "",
  },
  reducers: {
    // 增删性能待调整，是否允许换位显示？
    updateIRListStore: (state, action) => {
      console.log(action.payload);
      state.IRList = action.payload;
    },
    // 修改 SR 需求 ( payload 为 SR 信息)
    updateSRListStore: (state, action) => {
      console.log(action.payload);
      state.SRList = action.payload;
    },
  },
});

export const { updateIRListStore, updateSRListStore } = IRSRSlice.actions;

export const getIRListStore = (state: { ir_sr_store: { IRList: string } }) => {
  return state.ir_sr_store.IRList;
};

export const getSRListStore = (state: { ir_sr_store: { SRList: string } }) => {
  return state.ir_sr_store.SRList;
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
