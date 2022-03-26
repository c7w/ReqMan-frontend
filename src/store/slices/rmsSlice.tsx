import { createSlice } from "@reduxjs/toolkit";
import { IRCard, SRCard } from "../ConfigureStore";

export const rmsSlice = createSlice({
  name: "rms",
  initialState: {
    IRList: Array<IRCard>(), // add IRCard Components
    SRList: Array<SRCard>(),
  },
  reducers: {
    // 增删性能待调整，是否允许换位显示？
    // 增加 IR 需求 ( payload 为 IR 详细信息)
    addIR: (state, action) => {
      state.IRList.push(action.payload);
    },
    updateIR: (state, action) => {
      console.log(
        " ======================= updating ============================" +
          action.payload
      );
    },
    // 删除 IR 需求
    deleteIR: (state, action) => {
      state.IRList.filter((item) => item.id !== action.payload);
    },
    // 增加 SR 需求 ( payload 为 SR 详细信息 )
    addSR: (state, action) => {
      state.SRList.push(action.payload);
    },
    // 修改 SR 需求 ( payload 为 SR 信息)
    updateSR: (state, action) => {
      console.log(
        " ======================= updating ============================" +
          action.payload
      );
    },
    // 删除 SR 需求 ( payload 为待删除 SR 的 id )
    deleteSR: (state, action) => {
      state.SRList.filter((item) => item.id !== action.payload);
    },
    // 初始化 IRList
    initIRList: (state, action) => {
      console.log(action.payload);
    },
    // 初始化 SRList
    initSRList: (state, action) => {
      console.log(action.payload);
    },
  },
});

export const {
  addIR,
  updateIR,
  deleteIR,
  addSR,
  updateSR,
  deleteSR,
  initIRList,
  initSRList,
} = rmsSlice.actions;

export const getIRList = (state: { rms: { IRList: Array<IRCard> } }) => {
  return state.rms.IRList;
};

export const getSRList = (state: { rms: { SRList: Array<SRCard> } }) => {
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
