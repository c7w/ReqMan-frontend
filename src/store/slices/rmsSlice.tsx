import { createSlice } from "@reduxjs/toolkit";
import { SRCard } from "../ConfigureStore";

export const rmsSlice = createSlice({
  name: "rms",
  initialState: {
    IRList: "",
    SRList: Array<SRCard>(),
  },
  reducers: {
    // 增删性能待调整，是否允许换位显示？
    updateIRListStore: (state, action) => {
      console.log(action.payload);
      state.IRList = action.payload;
    },
    // 增加 SR 需求 ( payload 为 SR 详细信息 )
    addSRStore: (state, action) => {
      state.SRList.push(action.payload);
    },
    // 修改 SR 需求 ( payload 为 SR 信息)
    updateSRStore: (state, action) => {
      console.log(
        " ======================= updating ============================" +
          action.payload
      );
    },
    // 删除 SR 需求 ( payload 为待删除 SR 的 id )
    deleteSRStore: (state, action) => {
      state.SRList.filter((item) => item.id !== action.payload);
    },
  },
});

export const { updateIRListStore, addSRStore, updateSRStore, deleteSRStore } =
  rmsSlice.actions;

export const getIRListStore = (state: { rms: { IRList: string } }) => {
  return state.rms.IRList;
};

export const getSRListStore = (state: { rms: { SRList: Array<SRCard> } }) => {
  return state.rms.SRList;
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

export default rmsSlice.reducer;
